<?php

namespace IZal\Lshopify\Jobs\Product\Variant;

use IZal\Lshopify\Events\VariantDeleted;
use IZal\Lshopify\Models\Variant;

class DeleteVariant
{
    private Variant $variant;

    public function __construct(Variant $variant)
    {
        $this->variant = $variant;
    }

    public function handle()
    {
        $this->variant->delete();
        event(new VariantDeleted());
    }
}
