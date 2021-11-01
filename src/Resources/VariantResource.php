<?php

namespace IZal\Lshopify\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class VariantResource extends JsonResource
{
    public static $wrap = false;

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'options' => is_array($this->options) ? $this->options : [],
            'price' => $this->price,
            'compare_at_price' => $this->compare_at_price,
            'cost_price' => $this->cost_price,
            'quantity' => $this->quantity,
            'sku' => $this->sku ?: Str::random(8),
            'barcode' => $this->barcode,
            'weight' => $this->weight,
            'hs_code' => $this->hs_code,
            'origin_country_id' => $this->origin_country_id,
            'taxable' => $this->taxable,
            'track_quantity' => $this->track_quantity,
            'requires_shipping' => $this->requires_shipping,
            'out_of_stock_sale' => $this->out_of_stock_sale,
            'default' => $this->default,
            'physical_product' => $this->physical_product,
            'image' => new ImageResource($this->image),
            'product' => new ProductResource($this->whenLoaded('product')),
        ];
    }
}
