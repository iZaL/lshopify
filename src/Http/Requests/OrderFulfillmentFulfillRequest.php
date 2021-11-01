<?php

namespace IZal\Lshopify\Http\Requests;

class OrderFulfillmentFulfillRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'variants' => 'required|array',
        ];
    }
}
