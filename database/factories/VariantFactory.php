<?php

namespace IZal\Lshopify\Database\Factories;

use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Variant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class VariantFactory extends Factory
{
    protected $model = Variant::class;

    public function definition()
    {
        return [
            'product_id' => Product::factory()->create(),
            'price' => rand(100, 200),
            'compare_at_price' => rand(100, 200),
            'options' => [
                [
                    'label' => array_rand(['Size'=>'Size', 'Color'=>'Color']),
                    'value' => Str::random(4),
                ],
                [
                    'label' => array_rand(['Material'=>'Material', 'Style'=>'Style']),
                    'value' => Str::random(4),
                ],
            ],
            'sku' => Str::random(10),
            'quantity' => 10,

        ];
    }

    public function default()
    {
        return $this->state(function (array $attributes) {
            return [
                'default' => 1,
            ];
        });
    }
}
