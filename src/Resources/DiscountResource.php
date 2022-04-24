<?php

namespace IZal\Lshopify\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DiscountResource extends JsonResource
{
    public static $wrap = false;

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'code' => $this->code,
            'type' => $this->type,
            'value' => $this->value,
            'value_type' => $this->value_type,
            'target_type' => $this->target_type,
            'min_requirement_type' => $this->min_requirement_type,
            'min_requirement_value' => $this->min_requirement_value,
            'once_per_customer' => $this->once_per_customer,
            'usage_limit' => $this->usage_limit,
            'customer_selection' => $this->customer_selection,
            'customers' => CustomerResource::collection($this->whenLoaded('customers')),
        ];
    }
}
