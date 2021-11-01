<?php

namespace IZal\Lshopify\Http\Requests;

class RefundRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
//            'variants' => 'required|array',
//            'variants.*.id' => 'required|exists:variants,id',
//            'variants.*.pivot_quantity' => 'required|integer',
            'restock' => 'boolean',
        ];
    }
}
