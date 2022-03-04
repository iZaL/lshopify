<?php

namespace IZal\Lshopify\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CollectionResource extends JsonResource
{
    public static $wrap = false;

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'determiner' => $this->determiner,
            'type' => $this->type,
            'image' => new ImageResource($this->whenLoaded('image')),
            'conditions' => CollectionConditionResource::collection($this->whenLoaded('conditions')),
            'products' => ProductResource::collection(
                $this->isManual() ? $this->whenLoaded('products') : $this->smart_products()
            ),
        ];
    }
}
