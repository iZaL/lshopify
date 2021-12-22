<?php

namespace IZal\Lshopify\Database\Factories;

use IZal\Lshopify\Models\Fulfillment;
use IZal\Lshopify\Models\FulfillmentVariant;
use IZal\Lshopify\Models\Variant;
use Illuminate\Database\Eloquent\Factories\Factory;

class FulfillmentVariantFactory extends Factory
{
    protected $model = FulfillmentVariant::class;

    public function definition()
    {
        return [
            'fulfillment_id' => Fulfillment::factory()->create(),
            'variant_id' => Variant::factory()->create(),
            'status' => 'pending',
            'price' => 100,
            'unit_price' => 100,
            'total' => 100,
            'subtotal' => 100,
            'quantity' => 1,
        ];
    }
}
