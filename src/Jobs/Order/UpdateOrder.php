<?php

namespace IZal\Lshopify\Jobs\Order;

use IZal\Lshopify\Models\Order;

class UpdateOrder
{
    private Order $order;
    private array $attributes;

    public function __construct(Order $order, array $attributes)
    {
        $this->order = $order;
        $this->attributes = $attributes;
    }

    public function handle()
    {
        $order = $this->order;
        $order->update($this->attributes);

        if (isset($attributes['shipping'])) {
            $order->updateShippingAddress($attributes['shipping']);
        }

        if (isset($attributes['billing'])) {
            $order->updateBillingAddress($attributes['billing']);
        }
    }
}
