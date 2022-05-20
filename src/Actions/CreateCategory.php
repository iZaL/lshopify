<?php

namespace IZal\Lshopify\Actions;

use IZal\Lshopify\Models\Category;

class CreateCategory
{
    public function run(array $attributes): Category
    {
        return Category::create(
            collect($attributes)
                ->only((new Category())->getFillable())
                ->toArray()
        );
    }
}
