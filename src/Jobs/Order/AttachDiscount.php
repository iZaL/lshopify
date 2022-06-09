<?php

namespace IZal\Lshopify\Jobs\Order;

use IZal\Lshopify\Cart\Cart;
use IZal\Lshopify\Models\Order;

class AttachDiscount
{
    private Cart $cart;

    public function __construct(Cart $cart)
    {
        $this->cart = $cart;
    }

    public function run(Order $order, $name = 'Admin cart discount', $isAuto = 1)
    {
        $cartDiscount = $this->cart->getConditionByName('cart');
        if ($order->discount) {
            if ($cartDiscount) {
                $order->discount->update([
                    'value' => $cartDiscount->value,
                    'value_type' => $cartDiscount->suffix === 'percent' ? 'percent' : 'amount',
                    'reason' => $cartDiscount->reason,
                ]);
            } else {
                $order->removeDiscount();
            }
        } else {
            if ($cartDiscount) {
                $discount = $order->discount()->create([
                    'auto' => $isAuto,
                    'name' => $name,
                    'value' => $cartDiscount->value,
                    'value_type' => $cartDiscount->suffix === 'percent' ? 'percent' : 'amount',
                    'reason' => $cartDiscount->reason,
                ]);
                $order->discount_id = $discount->id;
                $order->save();
            }
        }
    }
}
