<?php

namespace IZal\Lshopify\Http\Controllers\Cart;

use IZal\Lshopify\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CartDiscountRemoveController extends Controller
{
    public function __invoke(Request $request): \Illuminate\Http\RedirectResponse
    {
        $this->validate($request, [
            'discount' => 'required|array',
            'item' => 'nullable',
        ]);

        $cart = app('cart');

        $cart->removeConditionByName($request->discount['name']);

        return redirect()->back();
    }
}
