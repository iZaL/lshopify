<?php

namespace IZal\Lshopify\Actions\Order;

use IZal\Lshopify\Cart\Cart;
use IZal\Lshopify\Models\Order;

class UpdateDiscount
{

    private Cart $cart;
    private AddDiscount $addDiscount;

    public function __construct(Cart $cart, AddDiscount $addDiscount)
    {
        $this->cart = $cart;
        $this->addDiscount = $addDiscount;
    }

    public function run(Order $order)
    {
        if($order->discount) {
            $cartDiscount = $this->cart->getConditionByName('cart');
            if($cartDiscount) {
                $order->discount->update([
                    'value' => $cartDiscount->value,
                    'value_type' => $cartDiscount->suffix === 'percent' ? 'percent' : 'amount',
                    'reason' => $cartDiscount->reason,
                ]);
            } else {
                $order->removeDiscount();
            }
        } else {
            $this->addDiscount->run($order);
        }
    }

}
