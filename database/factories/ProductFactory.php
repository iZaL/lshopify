<?php

namespace IZal\Lshopify\Database\Factories;

use IZal\Lshopify\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
        return [
            'title' => Str::random(16),
        ];
    }

    public function variants()
    {
        return $this->state(function (array $attributes) {
            return [
                //                'account_status' => 'suspended',
            ];
        });
    }
}
