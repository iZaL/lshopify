<?php

namespace IZal\Lshopify\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use IZal\Lshopify\Actions\DraftOrderCreateAction;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Resources\VariantResource;

class CartController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function add(Request $request, DraftOrderCreateAction $orderCreateAction): RedirectResponse
    {
        $this->validate($request, [
            'variantIDs' => 'nullable|array',
            'orderID' => 'nullable|exists:orders,id',
        ]);

        $variants = Variant::with(['product'])->find($request->variantIDs);

        $cart = app('cart');

        foreach ($cart->items() as $item) {
            if (!in_array($item->id, $request->variantIDs)) {
                $cart->remove($item->rowId);
            }
        }

        if ($variants->count()) {
            foreach ($variants as $variant) {
                $cartItem = $cart->find(['id' => $variant->id]);
                if (!$cartItem) {
                    $cart->add([
                        'id' => $variant->id,
                        'name' => $variant->id,
                        'price' => $variant->price,
                        'quantity' => 1,
                        'variant' => new VariantResource($variant),
                    ]);
                }
            }
        }

        return redirect()->back();
    }

    /**
     * @throws ValidationException
     */
    public function update(
        Request $request,
        DraftOrderCreateAction $orderCreateAction
    ): RedirectResponse {

        $this->validate($request,[
            'rowId' => 'required',
            'item' => 'required|array',
            'orderID' => 'nullable|exists:orders,id',
            'item.quantity' => 'required|integer|gt:0',
        ]);

        $cart = app('cart');
        $cart->item($request->rowId);
        $cart->update($request->rowId, $request->item);
        return redirect()->back();
    }

    public function remove(): RedirectResponse
    {
        $cart = app('cart');
        $cart->clear();

        if (session()->has('cartOrder')) {
            session()->forget('cartOrder');
        }

        return redirect()->back();
    }

    public function clear(): RedirectResponse
    {
        $cart = app('cart');
        $cart->clear();
        if (session()->has('cartOrder')) {
            session()->forget('cartOrder');
        }
        return redirect()->back();
    }
}
