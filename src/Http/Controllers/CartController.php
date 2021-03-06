<?php

namespace IZal\Lshopify\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use IZal\Lshopify\Jobs\Cart\AddCartItem;

class CartController extends Controller
{
    /**
     * @throws ValidationException
     */
    public function add(Request $request): RedirectResponse
    {
        $this->validate($request, [
            'variantIDs' => 'nullable|array',
            'orderID' => 'nullable|exists:orders,id',
        ]);

        $this->dispatch(new AddCartItem($request->variantIDs));
        return redirect()->back();
    }

    /**
     * @throws ValidationException
     */
    public function update(Request $request): RedirectResponse
    {
        $this->validate($request, [
            'rowId' => 'required',
            'item' => 'required|array',
            'orderID' => 'nullable|exists:orders,id',
            'item.quantity' => 'required|integer|gt:0',
        ]);
        $cart = app('cart');
        $cart->update($request->rowId, $request->item);
        return redirect()->back();
    }

    public function remove(Request $request): RedirectResponse
    {
        $this->validate($request, [
            'rowId' => 'required',
        ]);
        $cart = app('cart');
        $cart->remove($request->rowId);
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
