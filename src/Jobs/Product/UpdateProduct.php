<?php

namespace IZal\Lshopify\Jobs\Product;

use Illuminate\Http\UploadedFile;
use IZal\Lshopify\Events\ProductUpdated;
use IZal\Lshopify\Jobs\Product\Variant\UpdateVariant;
use IZal\Lshopify\Models\Category;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Models\Vendor;

class UpdateProduct
{
    private array $attributes;
    private Product $product;

    public function __construct(Product $product, array $attributes)
    {
        $this->product = $product;
        $this->attributes = $attributes;
    }

    public function handle()
    {
        $product = $this->product;
        $attributes = $this->attributes;

        $product->update($attributes);

        // product type
        if (isset($attributes['category'])) {
            $category = Category::find(optional($attributes['category'])['id']);
            if ($category) {
                $product->category()->associate($category);
            }
        }

        // Vendor
        if (isset($attributes['vendor'])) {
            $vendor = Vendor::find(optional($attributes['vendor'])['id']);
            if ($vendor) {
                $product->vendor()->associate($vendor);
            }
        }

        // tags
        if (isset($attributes['tags'])) {
            $product->syncTags(
                collect($attributes['tags'])
                    ->pluck('id')
                    ->toArray(),
                false
            );
        }

        // collection
        if (isset($attributes['collections'])) {
            $product->collections()->sync(
                collect($attributes['collections'])
                    ->pluck('id')
                    ->toArray(),
                false
            );
        }

        $defaultVariant = $product->default_variant;

        if($defaultVariant) {
            // update default variant
            if (isset($attributes['default_variant'])) {
                $defaultVariantAttributes = $attributes['default_variant'];
                $defaultVariant->update(
                    array_merge($defaultVariantAttributes,['options' => null]),
                );
            }

            if ($attributes['variants'] && !empty($attributes['variants'])) {
                foreach ($attributes['variants'] as $variantAttribute) {
                    $variant = Variant::find($variantAttribute['id']);
                    if ($variant) {
                        if (isset($variantAttribute['image']) && !($variantAttribute['image'] instanceof UploadedFile)) {
                            $variantAttribute['image_id'] = $variantAttribute['image']['id'] ?? null;
                        }
                        $variant->update($variantAttribute);
                    }
                }
            } else {
                if (isset($defaultVariantAttributes['options']) && !empty($defaultVariantAttributes['options'])) {
                    $defaultVariant->createOptions($defaultVariantAttributes['options']);
                }
            }
        }


        $product->push();

        event(new ProductUpdated($product));
        return $product;
    }
}
