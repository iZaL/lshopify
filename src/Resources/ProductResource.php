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
            'category' => new CategoryResource($this->whenLoaded('category')),
            'vendor' => new VendorResource($this->whenLoaded('vendor')),
            'images' => ImageResource::collection($this->whenLoaded('images')),
            'default_variant' => new VariantResource($this->whenLoaded('default_variant')),
            'variants' => VariantResource::collection($this->whenLoaded('variants')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'status' => $this->status,
            'collections' => CollectionResource::collection($this->whenLoaded('collections')),
            'seo_title' => $this->seo_title,
            'seo_description' => $this->seo_description,
            'seo_url' => $this->seo_url,
            'available_quantity' => $this->available_quantity,
            'variants_count' => $this->variants_count,
            'inventory_tracked' => $this->is_inventory_tracked,
        ];
    }
}
