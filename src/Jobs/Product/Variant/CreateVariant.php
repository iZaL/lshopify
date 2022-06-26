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
        $variant = new Variant();

        $variant->fill(array_merge($attributes,[
            'image_id' => null,
            'options' => null, //@todo
            'product_id' => $this->product->id
        ]));

        $variant->save();

        if (!empty($attributes['options'])) {
            if ($this->createOptions) {
                $variant->createOptions($attributes['options']);
            }
        }
        event(new VariantCreated($variant));
        return $variant;
    }
}
