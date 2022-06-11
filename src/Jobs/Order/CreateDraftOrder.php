<?php

namespace IZal\Lshopify\Jobs\Order;

use IZal\Lshopify\Models\DraftOrder;

class CreateDraftOrder extends CreateOrder
{

    public function __construct()
    {
        $this->cart = app('cart');
    }

    /**
     * @return DraftOrder
     */
    public function handle(): DraftOrder
    {
        $order = new DraftOrder();
        $order->fill($this->cart->getCartData());
        $order->save();

        $order->createCartDiscount();
        $order->syncCartVariants();

        return $order;
    }
}
