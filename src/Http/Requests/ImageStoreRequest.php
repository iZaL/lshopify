<?php

namespace IZal\Lshopify\Http\Requests;

class ImageStoreRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'images' => 'required|array',
            'images.*' => 'image',
            'imageable_id' => 'required',
            'imageable_type' => 'required',
        ];
    }
}
