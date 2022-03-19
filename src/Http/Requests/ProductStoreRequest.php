<?php

namespace IZal\Lshopify\Http\Requests;

class ProductStoreRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'title' => 'required|max:255',
            'variants.*.price' => 'nullable|numeric',
            'variants.*.quantity' => 'nullable|integer',
            'variants.*.compare_at_price' => 'nullable|numeric',
            'variants.*.cost_price' => 'nullable|numeric',
            'variants.*.sku' => 'nullable|string|max:255',
            'variants.*.weight' => 'nullable|numeric',
            'variants.*.barcode' => 'nullable|string|max:255',
            'variants.*.taxable' => 'nullable|boolean',
            'variants.*.tracked' => 'nullable|boolean',
            'variants.*.requires_shipping' => 'nullable|boolean',
            'variants.*.out_of_stock_sale' => 'nullable|boolean',
        ];
    }
}
