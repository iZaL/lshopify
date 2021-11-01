<?php

namespace IZal\Lshopify\Http\Requests;

class DraftOrderUpdateRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'shipping' => 'nullable|array',
            'billing' => 'nullable|array',
        ];
    }
}
