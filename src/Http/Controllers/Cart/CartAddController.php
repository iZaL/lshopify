<?php

namespace IZal\Lshopify\Http\Controllers\Cart;

use IZal\Lshopify\Actions\DraftOrderCreateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Resources\VariantResource;
use Illuminate\Http\Request;

class CartAddController extends Controller
{
    public function __invoke(
        Request $request,
        DraftOrderCreateAction $orderCreateAction
    ): \Illuminate\Http\RedirectResponse {
        $this->validate($request, [
            'variantIDs' => 'nullable|array',
            'orderID' => 'nullable|exists:orders,id',
        ]);

        $variants = Variant::with(['product'])->find($request->variantIDs);

        $cart = app('cart');

        foreach ($cart->items() as $item) {
            if (! in_array($item->id, $request->variantIDs)) {
                $cart->remove($item->rowId);
            }
        }

        if ($variants->count()) {
            foreach ($variants as $variant) {
                $cartItem = $cart->find(['id' => $variant->id]);
                if (! $cartItem) {
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
}
