<?php

namespace IZal\Lshopify\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public static $wrap = false;

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'location' => $this->location,
            'phone' => $this->phone,
            'email' => $this->email,
            'orders_count' => $this->orders_count,
            'addresses' => CustomerAddressResource::collection($this->whenLoaded('addresses')),
        ];
    }
}
