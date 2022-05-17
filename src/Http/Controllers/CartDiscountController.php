<?php

namespace IZal\Lshopify\Http\Controllers;

use Illuminate\Http\Request;
use IZal\Lshopify\Cart\Condition;
use IZal\Lshopify\Http\Requests\DiscountStoreRequest;

class CartDiscountController extends Controller
{
    /**
     * Add discount for cart
     * @param DiscountStoreRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function add(DiscountStoreRequest $request): \Illuminate\Http\RedirectResponse
    {
        $cart = app('cart');

        $discount = new Condition($request->discount);

        $suffix = $request->discount['suffix'] === 'percent' ? '%' : '';

        $discount->setActions([
            [
                'value' => '-' . $request->discount['value'] . $suffix,
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

    /**
     * Remove discount from cart
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Validation\ValidationException
     */
    public function remove(Request $request): \Illuminate\Http\RedirectResponse
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
