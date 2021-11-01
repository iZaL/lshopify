<?php

namespace IZal\Lshopify\Http\Requests;

class ImageDeleteRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'images' => 'required|array',
        ];
    }
}
