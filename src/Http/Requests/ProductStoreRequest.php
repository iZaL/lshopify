<?php

namespace IZal\Lshopify\Http\Requests;

class ProductStoreRequest extends VariantFieldRequest
{
    public function rules()
    {
        $array1 = $this->validate('variants.*.');
        $array2 = $this->validate('default_variant.');
        return array_merge(
            [
                'title' => 'required|max:255',
            ],
            $array1,
            $array2
        );
    }
}
