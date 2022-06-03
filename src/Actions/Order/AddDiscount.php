<?php

namespace IZal\Lshopify\Actions\Order;

use IZal\Lshopify\Cart\Cart;
use IZal\Lshopify\Models\Order;

class AddDiscount
{

    private Cart $cart;

    public function __construct(Cart $cart)
    {
        $this->cart = $cart;
    }

    public function run(Order $order,$name = 'Admin cart discount',$isAuto = 1)
    {
        $cartDiscount = $this->getCartDiscount();
        if($cartDiscount) {
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

    public function getCartDiscount()
    {
        return $this->cart->getConditionByName('cart');
    }
}
