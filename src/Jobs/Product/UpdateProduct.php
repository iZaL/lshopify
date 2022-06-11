<?php

namespace IZal\Lshopify\Jobs\Product;

use Illuminate\Http\UploadedFile;
use IZal\Lshopify\Jobs\Product\Variant\CreateVariant;
use IZal\Lshopify\Jobs\Product\Variant\UpdateVariant;
use IZal\Lshopify\Models\Category;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Vendor;

class UpdateProduct
{
    private array $attributes;
    private Product $product;

    public function __construct(Product $product, array $attributes)
    {
        $this->attributes = $attributes;
        $this->product = $product;
    }

    public function handle()
    {
        $attributes = $this->attributes;
        $product = $this->product;

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

        // update default variant

        if (isset($attributes['default_variant'])) {
            $defaultVariantAttributes = $attributes['default_variant'];
            $defaultVariant = $product->default_variant;

            if ($defaultVariant) {
                $defaultVariant->update($defaultVariantAttributes);

                if (isset($defaultVariantAttributes['options']) && !empty($defaultVariantAttributes['options'])) {
                    CreateVariant::createVariantOptionWithValues($defaultVariant, $defaultVariantAttributes['options']);
                }
            }
        }

        if (!empty($attributes['variants'])) {
            foreach ($attributes['variants'] as $variantAttribute) {
                $variant = $product->variants()->find($variantAttribute['id']);
                if ($variant) {
                    if (isset($variantAttribute['image']) && !($variantAttribute['image'] instanceof UploadedFile)) {
                        $variantAttribute['image_id'] = $variantAttribute['image']['id'] ?? null;
                    }
                    $variant->update($variantAttribute);
                    if (isset($variantAttribute['options'])) {
                        UpdateVariant::updateVariantOptions($variant, $variantAttribute['options']);
                    }
                }
            }
        }

        return $product;
    }
}
