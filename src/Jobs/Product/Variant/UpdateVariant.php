<?php

namespace IZal\Lshopify\Jobs\Product\Variant;

use IZal\Lshopify\Events\VariantUpdated;
use IZal\Lshopify\Models\Variant;

class UpdateVariant
{
    private Variant $variant;
    private $variantOptions;

    public function __construct(Variant $variant, $variantOptions) {
        $this->variant = $variant;
        $this->variantOptions = $variantOptions;
    }

    public function handle()
    {
        $variant = $this->variant;
        $options = [];
        foreach ($this->variantOptions as $option) {
            $options[] = ['name' => $option['name'], 'id' => $option['id']];
        }
        $variant->options = $options;
        $variant->save();

        event(new VariantUpdated($variant));
    }
}
