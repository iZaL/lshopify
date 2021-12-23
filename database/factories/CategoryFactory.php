<?php

namespace IZal\Lshopify\Database\Factories;

use IZal\Lshopify\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition()
    {
        return [
            'name' => Str::random(6),
        ];
    }
}
