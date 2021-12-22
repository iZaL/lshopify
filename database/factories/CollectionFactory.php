<?php

namespace IZal\Lshopify\Database\Factories;

use IZal\Lshopify\Models\Collection;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CollectionFactory extends Factory
{
    protected $model = Collection::class;

    public function definition()
    {
        return [
            'name' => Str::random(6),
        ];
    }
}
