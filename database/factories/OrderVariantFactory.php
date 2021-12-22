<?php

namespace IZal\Lshopify\Database\Factories;

use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Models\OrderVariant;
use IZal\Lshopify\Models\Variant;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderVariantFactory extends Factory
{
    protected $model = OrderVariant::class;

    public function definition()
    {
        return [
            'order_id' => DraftOrder::factory()->create(),
            'variant_id' => Variant::factory()->create(),
            'price' => 100,
            'unit_price' => 100,
            'total' => 100,
            'subtotal' => 100,
            'quantity' => 1,
        ];
    }
}
