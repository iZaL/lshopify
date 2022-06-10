<?php

namespace IZal\Lshopify\Events;

use IZal\Lshopify\Models\Product;

class ProductDeleted
{
    /**
     * @param Product $product
     */
    public function __construct(Product $product)
    {
    }
}
