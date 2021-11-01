<?php

namespace IZal\Lshopify\Http\Requests;

class CartUpdateRequest extends BaseFormRequest
{
    public function rules()
    {
        return [
            'rowId' => 'required',
            'item' => 'required|array',
            'orderID' => 'nullable|exists:orders,id',
            'item.quantity' => 'required|integer|gt:0',
        ];
    }
}
