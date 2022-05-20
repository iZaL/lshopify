<?php

namespace IZal\Lshopify\Http\Requests;

use JetBrains\PhpStorm\ArrayShape;

class CategoryStoreRequest extends BaseFormRequest
{
    #[ArrayShape(['name' => 'string'])]
    public function rules(): array
    {
        return [
            'name' => 'required|unique:categories,name',
        ];
    }
}
