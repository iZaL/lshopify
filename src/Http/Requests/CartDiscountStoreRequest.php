<?php

namespace IZal\Lshopify\Http\Requests;

use Illuminate\Validation\Rule;

class CartDiscountStoreRequest extends VariantFieldRequest
{
    public function rules()
    {
        return [
            'discount' => 'required|array',
            'discount.name' => 'required',
            'discount.type' => 'required',
            'discount.value' => 'required|integer|gt:0',
            'discount.suffix' => 'required',
            'item' => 'nullable',
        ];
    }
}
