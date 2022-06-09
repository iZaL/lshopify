<?php

namespace IZal\Lshopify\Jobs\Product;

use Illuminate\Contracts\Database\Query\Builder;

class DeleteProduct
{
    public function execute(Builder $products)
    {
        $products->delete();
    }
}
