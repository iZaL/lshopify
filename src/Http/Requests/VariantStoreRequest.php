<?php

namespace IZal\Lshopify\Http\Requests;

class VariantStoreRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'options' => 'required|array',
            'options.*.id' => 'required|string',
            'quantity' => 'nullable|integer',
            'price' => 'nullable|numeric',
            'compare_at_price' => 'nullable|numeric',
            'cost_price' => 'nullable|numeric',
            'sku' => 'nullable|string|max:255',
            'weight' => 'nullable|numeric',
            'barcode' => 'nullable|string|max:255',
            'taxable' => 'nullable|boolean',
            'tracked' => 'nullable|boolean',
            'requires_shipping' => 'nullable|boolean',
            'out_of_stock_sale' => 'nullable|boolean',
        ];
    }
}
