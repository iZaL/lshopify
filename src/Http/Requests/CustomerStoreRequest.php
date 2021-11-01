<?php

namespace IZal\Lshopify\Http\Requests;

class CustomerStoreRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'customer' => 'required|array',
            'customer.first_name' => 'required|alpha',
            'customer.last_name' => 'required|alpha',
            'customer.email' => 'required|email|unique:customers,email',
            'address' => 'nullable|array',
        ];
    }
}
