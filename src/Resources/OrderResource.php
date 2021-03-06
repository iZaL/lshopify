<?php

namespace IZal\Lshopify\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public static $wrap = false;

    public function toArray($request)
    {
        $customer = optional($this->customer);

        return array_merge_recursive(
            [
                'id' => $this->id,
                'total' => $this->total,
                'total_formatted' => $this->total_formatted,
                'subtotal' => $this->subtotal,
                'quantity' => $this->quantity,
                'customer' => new CustomerResource($this->whenLoaded('customer')),
                'contact_email' => $this->contact_email ?? $customer->email,
                'contact_phone' => $this->contact_phone ?? $customer->phone,
                'variants' => OrderVariantResource::collection($this->whenLoaded('variants')),
                'workflows' => WorkflowResource::collection($this->whenLoaded('workflows')),
                'fulfillments' => WorkflowResource::collection($this->whenLoaded('fulfillments')),
                'success_fulfillments' => WorkflowResource::collection($this->whenLoaded('success_fulfillments')),
                'payments' => TransactionResource::collection($this->whenLoaded('success_payments')),
                'is_payment_pending' => $this->isPaymentPending(),
                'date' => $this->date,
                'date_time' => $this->date_time,
                'status' => ucfirst($this->status),
                'payment_status' => 'Pending',
                'fulfillment_status' => 'Pending',
                'items_count' => 5,
            ],

            ['shipping' => $this->getShippingAddress()],
            ['billing' => $this->getBillingAddress()]
        );
    }

    public function getShippingAddress(): array
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

        $attributes = [];
        foreach ($fields as $field) {
            $attributes[$field] = $this->{'shipping_' . $field};
        }

        return $attributes;
    }

    public function getBillingAddress(): array
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

        $attributes = [];
        foreach ($fields as $field) {
            $attributes[$field] = $this->{'billing_' . $field};
        }

        return $attributes;
    }
}
