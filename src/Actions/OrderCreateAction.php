<?php

namespace IZal\Lshopify\Actions;

use IZal\Lshopify\Managers\FulfillmentManager;
use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Models\Order;
use Illuminate\Database\Eloquent\Model;

class OrderCreateAction
{
    public function createOrderFromDraft(DraftOrder $draftOrder)
    {
        abort_unless($draftOrder->draft(), 403);
        $draftOrder->forceFill(['draft' => 0]);
        $draftOrder->save();

        //        $this->createOrderFulfillment($draftOrder);
    }

    public function createOrderFulfillment(Order $order)
    {
        abort_if($order->draft(), 403);
    }

    /**
     * @param  DraftOrder $order
     * @return array
     */
    public function getShippingAddress(Model $order): array
    {
        $customer = optional($order->customer);
        $defaultAddress = optional($customer->default_address);

        $fields = ['company', 'address1', 'address2', 'city', 'province', 'street', 'zip', 'country', 'phone'];

        $attributes = [
            'full_name' => $order->shipping_full_name ?? $customer->full_name,
            'first_name' => $order->shipping_first_name ?? $customer->first_name,
            'last_name' => $order->shipping_last_name ?? $customer->last_name,
        ];

        foreach ($fields as $field) {
            $attributes[$field] = $order->{'shipping_' . $field} ?? $defaultAddress->{$field};
        }

        return $attributes;
    }

    /**
     * @param  DraftOrder  $order
     * @return array
     */
    protected function getBillingAddress(Model $order): array
    {
        $fields = [
            'full_name',
            'first_name',
            'last_name',
            'company',
            'address1',
            'address2',
            'city',
            'province',
            'street',
            'zip',
            'country',
            'phone',
        ];

        $shippingAttributes = $this->getShippingAddress($order);

        $attributes = [];
        foreach ($fields as $field) {
            $attributes[$field] = $order->{'billing_' . $field} ?? $shippingAttributes[$field];
        }

        return $attributes;
    }
}
