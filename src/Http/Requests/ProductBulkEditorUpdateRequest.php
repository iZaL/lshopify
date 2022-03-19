<?php

namespace IZal\Lshopify\Http\Requests;

class ProductBulkEditorUpdateRequest extends VariantFieldRequest
{
    public function rules()
    {
        $array1 = $this->validate('products.*.variants.*.');
        $array2 = $this->validate('products.*.default_variant.');
        return array_merge(
            [
                'products.*.title' => 'required|max:255',
            ],
            $array1,
            $array2
        );
    }
}
