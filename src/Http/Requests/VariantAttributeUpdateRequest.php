<?php

namespace IZal\Lshopify\Http\Requests;

class VariantAttributeUpdateRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'variants' => 'required|array',
            'variants.*' => 'exists:variants,id',
            'field' => 'required',
            'value' => 'required',
        ];
    }
}
