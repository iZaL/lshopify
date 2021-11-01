<?php

namespace IZal\Lshopify\Http\Requests;

class VariantStoreRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'options' => 'required|array',
            'options.*.id' => 'required|string',
        ];
    }
}
