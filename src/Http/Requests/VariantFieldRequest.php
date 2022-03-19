<?php

namespace IZal\Lshopify\Http\Requests;

class VariantFieldRequest extends BaseFormRequest
{
    protected function validate($prefix)
    {


        $variantFields = $this->getVariantFields();

        // loop variantFields array and append $key to each key
        $newArray = [];
        foreach ($variantFields as $key => $value) {
            $newArray[$prefix . $key] = $value;
        }
        return $newArray;
    }

    protected function getVariantFields()
    {
        $variantFields = [
            'price' => 'nullable|numeric',
            'quantity' => 'nullable|integer',
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
        return $variantFields;
    }
}
