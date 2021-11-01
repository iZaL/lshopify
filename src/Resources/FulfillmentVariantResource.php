<?php

namespace IZal\Lshopify\Resources;

class FulfillmentVariantResource extends VariantResource
{
    public static $wrap = false;

    public function toArray($request)
    {

        $variantArray = parent::toArray($request);

        return  array_merge($variantArray, [
            'pivot_id' => $this->pivot->id,
            'pivot_quantity' => $this->pivot->quantity,
            'pivot_subtotal' => $this->pivot->subtotal,
            'pivot_total' => $this->pivot->total,
            'pivot_price' => $this->pivot->price,
            'pivot_unit_price' => $this->pivot->unit_price,
        ]);
    }
//    public function toArray($request)
//    {
//
//        $variantArray = parent::toArray($request);
//
//        return  array_merge($variantArray, [
//            'pivot_id' => $this->pivot->id,
//            'pivot_quantity' => $this->pivot->quantity,
//            'pivot_subtotal' => $this->pivot->subtotal,
//            'pivot_total' => $this->pivot->total,
//            'pivot_price' => $this->pivot->price,
//            'pivot_unit_price' => $this->pivot->unit_price,
//        ]);
//    }
}
