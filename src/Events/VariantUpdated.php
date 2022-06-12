<?php

namespace IZal\Lshopify\Events;

use IZal\Lshopify\Models\Variant;

class VariantUpdated
{
    public function __construct(Variant $variant)
    {
    }
}
