<?php

namespace IZal\Lshopify\Events;

use IZal\Lshopify\Models\Variant;

class VariantCreated
{

    public function __construct(Variant $variant)
    {
    }
}
