<?php

namespace IZal\Lshopify\Jobs\Product\Variant;

class UpdateVariant
{
    public static function updateVariantOptions($variant, $variantOptions)
    {
        $options = [];
        foreach ($variantOptions as $option) {
            $options[] = ['name' => $option['name'], 'id' => $option['id']];
        }
        $variant->options = $options;
        $variant->save();
    }
}
