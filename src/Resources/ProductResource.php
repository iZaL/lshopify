<?php

namespace IZal\Lshopify\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public static $wrap = false;

    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'image' => new ImageResource($this->default_image),
            'product_type' => new CategoryResource($this->whenLoaded('category')),
            'images' => ImageResource::collection($this->whenLoaded('images')),
            'default_variant' => new VariantResource($this->whenLoaded('default_variant')),
            'variants' => VariantResource::collection($this->whenLoaded('variants')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'status' => $this->status,
            'collections' => CollectionResource::collection($this->whenLoaded('collections')),
        ];
    }
}
