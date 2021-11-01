<?php

namespace IZal\Lshopify\Http\Controllers\Cart;

use IZal\Lshopify\Http\Controllers\Controller;

class CartClearController extends Controller
{
    public function __invoke(): \Illuminate\Http\RedirectResponse
    {
        $cart = app('cart');
        $cart->clear();

        if (session()->has('cartOrder')) {
            session()->forget('cartOrder');
        }

        return redirect()->back();
    }
}
