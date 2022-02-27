<?php

namespace IZal\Lshopify\Http\Requests;

class RefundRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'pending_fulfillments' => 'array',
            'fulfillments' => 'array',
            'restock' => 'boolean',
        ];
    }
}
