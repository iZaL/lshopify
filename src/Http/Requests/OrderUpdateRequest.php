<?php

namespace IZal\Lshopify\Http\Requests;

class OrderUpdateRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'shipping' => 'nullable|array',
            'billing' => 'nullable|array',
        ];
    }
}
