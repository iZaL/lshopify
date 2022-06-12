<?php

namespace IZal\Lshopify\Events;

use IZal\Lshopify\Models\Product;

class ProductCreated
{
    public function __construct(Product $product)
    {
    }
}
