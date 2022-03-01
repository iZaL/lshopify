<?php

namespace IZal\Lshopify\Http\Requests;

class ReturnRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'fulfillments' => 'array',
        ];
    }
}
