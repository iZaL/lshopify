<?php

namespace IZal\Lshopify\Http\Requests;

use Illuminate\Validation\Rule;

class DiscountStoreRequest extends VariantFieldRequest
{
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'type' => ['required', 'string', Rule::in(['code', 'automatic'])],
            'value_type' => ['required', 'string', Rule::in(['percent', 'amount'])],
            'value' => ['required', 'numeric'],
            'target_type' => ['required', 'string', Rule::in(['all_products', 'products', 'collections'])],
            'min_requirement_type' => ['nullable', 'string', Rule::in(['amount', 'quantity'])],
            'min_requirement_value' => ['numeric'],
            'once_per_customer' => ['boolean'],
            'usage_limit' => ['nullable', 'numeric'],
            'customer_selection' => ['required', 'string', Rule::in(['all', 'custom', 'none'])],
            'starts_at' => 'required|date',
            'ends_at' => 'required|date',
        ];
    }
}
