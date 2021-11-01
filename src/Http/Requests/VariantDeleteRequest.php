<?php

namespace IZal\Lshopify\Http\Requests;

class VariantDeleteRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'variants' => 'required|array',
        ];
    }
}
