<?php

namespace IZal\Lshopify\Actions\Product;

use Illuminate\Contracts\Database\Query\Builder;

class DeleteProduct
{
    public function execute(Builder $products)
    {
        $products->delete();
    }
}
