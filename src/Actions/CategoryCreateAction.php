<?php

namespace IZal\Lshopify\Actions;

use IZal\Lshopify\Models\Category;

class CategoryCreateAction
{
    /**
     * @var Category
     */
    private $category;

    /**
     * CategoryCreateAction constructor.
     */
    public function __construct(Category $category)
    {
        $this->category = $category;
    }

    public function create(array $attributes): Category
    {
        return $this->category->create(
            collect($attributes)
                ->only($this->category->getFillable())
                ->toArray()
        );
    }
}
