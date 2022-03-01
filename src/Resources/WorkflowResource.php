<?php

namespace IZal\Lshopify\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class WorkflowResource extends JsonResource
{
    public static $wrap = false;

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'type' => ucfirst($this->type),
            'status' => $this->status,
            'variants' => WorkflowVariantResource::collection($this->variants),
            'order' => new OrderResource($this->whenLoaded('order')),
        ];
    }
}
