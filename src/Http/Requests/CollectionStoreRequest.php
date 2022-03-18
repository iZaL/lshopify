<?php

namespace IZal\Lshopify\Http\Requests;

class CollectionStoreRequest extends BaseFormRequest
{
    public function rules()
    {
        $id = request('id') ? ',' . request('id') : '';

        return [
            'name' => 'required|unique:collections,name' . $id,
            'type' => 'required|in:smart,manual',
            'determiner' => 'required_if:type,smart|in:all,any',
            'conditions' => 'required_if:type,smart|array',
            'conditions.*.field' => 'required_if:type,smart',
            'conditions.*.criteria' => 'required_if:type,smart',
            'conditions.*.value' => 'required_if:type,smart',
        ];
    }
}
