<?php

namespace IZal\Lshopify\Database\Factories;

use IZal\Lshopify\Models\Tag;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TagFactory extends Factory
{
    protected $model = Tag::class;

    public function definition()
    {
        return [
            'name' => Str::random(6),
        ];
    }
}
