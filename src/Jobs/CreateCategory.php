<?php

namespace IZal\Lshopify\Jobs;

use IZal\Lshopify\Events\CategoryCreated;
use IZal\Lshopify\Models\Category;
use IZal\Lshopify\Models\Product;

class CreateCategory
{
    private array $attributes;

    public function __construct(array $attributes)
    {
        $this->attributes = $attributes;
    }

    public function handle(): Category
    {
        $attributes = $this->attributes;

        $category = new Category();
        $category->fill($attributes);
        $category->save();

        if (isset($attributes['product_id'])) {
            $product = Product::find($attributes['product_id']);
            $product->category()->associate($category);
            $product->save();
        }

        event(new CategoryCreated($category));

        return $category;
    }
}
