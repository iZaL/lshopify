<?php

namespace IZal\Lshopify\Http\Requests;

class TagStoreRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'name' => 'required|unique:tags,name',
        ];
    }
}
