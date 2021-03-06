<?php

namespace IZal\Lshopify\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DiscountResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'auto' => $this->auto,
            'value' => $this->value,
            'value_type' => $this->value_type,
            'target_type' => $this->target_type,
            'min_requirement_type' => $this->min_requirement_type,
            'min_requirement_value' => $this->min_requirement_value,
            'once_per_customer' => $this->once_per_customer,
            'usage_limit' => $this->usage_limit,
            'customer_selection' => $this->customer_selection,
            'starts_at' => $this->starts_at,
            'ends_at' => $this->ends_at,
            'customers' => CustomerResource::collection($this->whenLoaded('customers')),
            'collections' => CollectionResource::collection($this->whenLoaded('collections')),
            'variants' => VariantResource::collection($this->whenLoaded('variants')),
        ];
    }
}
