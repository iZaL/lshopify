<?php

namespace IZal\Lshopify\Http\Requests;

class VariantStoreRequest extends VariantFieldRequest
{
    public function rules()
    {
        $array1 = $this->validate('');
        return array_merge([
            'options' => 'required|array',
            'options.*.id' => 'required|string',
        ],$array1);
    }
}
