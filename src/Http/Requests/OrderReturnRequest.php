<?php

namespace IZal\Lshopify\Http\Requests;

class OrderReturnRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'variants' => 'required|array',
        ];
    }
}
