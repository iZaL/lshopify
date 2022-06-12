<?php

namespace IZal\Lshopify\Jobs\Product\Variant;

use IZal\Lshopify\Events\VariantUpdated;
use IZal\Lshopify\Models\Variant;

class UpdateVariant
{
    private Variant $variant;
    private $options;

    public function __construct(Variant $variant, $options) {
        $this->variant = $variant;
        $this->options = $options;
    }

    public function handle()
    {
        $variant = $this->variant;
        $options = [];
        foreach ($this->options as $option) {
            $options[] = ['name' => $option['name'], 'id' => $option['id']];
        }
        $variant->options = $options;
        $variant->save();

        event(new VariantUpdated($variant));
    }
}
