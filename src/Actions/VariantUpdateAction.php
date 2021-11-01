<?php

namespace IZal\Lshopify\Actions;

use IZal\Lshopify\Models\Variant;

class VariantUpdateAction
{
    /**
     * @var Variant
     */
    private $variantModel;

    public function __construct(Variant $variantModel)
    {
        $this->variantModel = $variantModel;
    }

    public function updateVariantOptions($variant, $variantOptions): self
    {
        $options = [];
        foreach ($variantOptions as $option) {
            $options[] = ['name' => $option['name'], 'id' => $option['id']];
        }
        $variant->options = $options;
        $variant->save();

        return $this;
    }
}
