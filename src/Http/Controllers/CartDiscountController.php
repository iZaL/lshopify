<?php

namespace IZal\Lshopify\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use IZal\Lshopify\Cart\Condition;
use IZal\Lshopify\Http\Requests\CartDiscountStoreRequest;

class CartDiscountController extends Controller
{
    /**
     * Add discount for cart
     * @param CartDiscountStoreRequest $request
     * @return RedirectResponse
     */
    public function add(CartDiscountStoreRequest $request): RedirectResponse
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
     * @return RedirectResponse
     * @throws ValidationException
     */
    public function remove(Request $request): RedirectResponse
    {
        $this->validate($request, [
            'discount' => 'required|array',
            'item' => 'nullable',
        ]);
        $cart = app('cart');
        $cart->removeConditionByName($request->discount['name']);
        session()->forget('cart_order');
        return redirect()->back();
    }
}
