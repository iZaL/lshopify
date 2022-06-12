<?php

namespace IZal\Lshopify\Jobs\Product\Variant;

use IZal\Lshopify\Events\VariantCreated;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Variant;

class CreateVariant
{
    private array $variantAttributes;
    private Product $product;
    private bool $createOptions;

    /**
     * @param Product $product
     * @param array $variantAttributes
     * @param bool $createOptions
     */
    public function __construct(Product $product, array $variantAttributes, bool $createOptions = false)
    {
        $this->variantAttributes = $variantAttributes;
        $this->product = $product;
        $this->createOptions = $createOptions;
    }

    public function handle(): Variant
    {
        $attributes = $this->variantAttributes;
        $attributes['product_id'] = $this->product->id;
        $variant = new Variant();
        unset($attributes['image_id']);
        $variant->fill($attributes);
        $variant->save();

        if (!empty($attributes['options'])) {
            if ($this->createOptions) {
                $variant->createOptions();
            }
        }
        event(new VariantCreated($variant));
        return $variant;
    }
}
