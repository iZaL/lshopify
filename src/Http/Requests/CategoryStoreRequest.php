<?php

namespace IZal\Lshopify\Http\Requests;

class CategoryStoreRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'name' => 'required|unique:categories,name',
        ];
    }
}
