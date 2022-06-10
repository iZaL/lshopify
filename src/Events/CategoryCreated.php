<?php

namespace IZal\Lshopify\Events;

use IZal\Lshopify\Models\Category;

class CategoryCreated
{
    public function __construct(Category $category)
    {
    }
}
