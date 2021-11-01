<?php

namespace IZal\Lshopify\Http\Requests;

class ProductStoreRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'title' => 'required|max:255',
            'description' => '',
            //            'variants' =>
        ];
    }
}
