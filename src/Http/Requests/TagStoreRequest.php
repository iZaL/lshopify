<?php

namespace IZal\Lshopify\Http\Requests;

class TagStoreRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'name' => 'required|string|max:50|min:2',
            'taggable_type' => 'nullable',
            'taggable_id' => 'nullable',
        ];
    }
}
