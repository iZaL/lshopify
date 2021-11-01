<?php

namespace IZal\Lshopify\Actions;

use IZal\Lshopify\Models\CustomerAddress;
use IZal\Lshopify\Models\Order;
use Illuminate\Support\Arr;

class OrderUpdateAction extends OrderCreateAction
{
    public function update(Order $order, array $attributes)
    {
        $order->update(Arr::only($attributes, $order->getFillable()));
    }

    /**
     * @param  Order  $order
     * @param  array  $attributes
     */
    public function updateShippingAddress(Order $order, array $attributes = [])
    {
        $shippingAttributes = empty($attributes) ? $this->getShippingAddress($order) : $attributes;
        $attributes = CustomerAddress::parseShippingAddress($shippingAttributes, $order->getFillable());
        $order->update($attributes);
    }

    /**
     * @param  Order  $order
     * @param  array  $attributes
     */
    public function updateBillingAddress(Order $order, array $attributes = [])
    {
        $billingAttributes = empty($attributes) ? $this->getBillingAddress($order) : $attributes;
        $attributes = CustomerAddress::parseBillingAddress($billingAttributes, $order->getFillable());
        $order->update($attributes);
    }
}
