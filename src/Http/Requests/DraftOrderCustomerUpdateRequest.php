<?php

namespace IZal\Lshopify\Http\Requests;

class DraftOrderCustomerUpdateRequest extends BaseFormRequest
{
    public function rules()
    {
        return ['customer_id' => 'nullable|exists:customers,id'];
    }
}
