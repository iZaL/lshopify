<?php

namespace IZal\Lshopify\Events;

use IZal\Lshopify\Models\Product;

class ProductUpdated
{

    public function __construct(Product $product)
    {
    }
}
