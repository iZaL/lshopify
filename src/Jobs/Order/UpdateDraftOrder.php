<?php

namespace IZal\Lshopify\Jobs\Order;

use Illuminate\Support\Arr;
use IZal\Lshopify\Cart\Cart;
use IZal\Lshopify\Models\DraftOrder;

class UpdateDraftOrder extends CreateOrder
{
    private Cart $cart;

    /**
     * DraftOrderCreateAction constructor.
     * @param Cart $cart
     */
    public function __construct(Cart $cart)
    {
        $this->cart = $cart;
    }

    /**
     * @param  DraftOrder  $order
     * @param  array  $attributes
     */
    public function update(DraftOrder $order, array $attributes)
    {
        $order->update(array_merge($this->cart->getCartData(), Arr::only($attributes, $order->getFillable())));
        $order->createCartDiscount();
        $order->updateCartVariants();
    }
}
