<?php

namespace IZal\Lshopify\Http\Controllers\Cart;

use IZal\Lshopify\Cart\Condition;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\DiscountStoreRequest;

class CartDiscountAddController extends Controller
{
    public function __invoke(DiscountStoreRequest $request): \Illuminate\Http\RedirectResponse
    {
        $cart = app('cart');

        $discount = new Condition($request->discount);

        $suffix = $request->discount['suffix'] === 'percentage' ? '%' : '';

        $discount->setActions([
            [
                'value' => '-'.$request->discount['value'].$suffix,
            ],
        ]);

        if ($request->item) {
            $data = ['conditions' => $discount];
            $cart->update($request->item['rowId'], $data);
        } else {
            $cart->removeConditionByName('cart');
            $cart->condition($discount);
        }

        return redirect()->back();
    }
}
