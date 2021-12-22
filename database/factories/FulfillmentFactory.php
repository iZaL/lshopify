<?php

namespace IZal\Lshopify\Database\Factories;

use IZal\Lshopify\Models\Fulfillment;
use IZal\Lshopify\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class FulfillmentFactory extends Factory
{
    protected $model = Fulfillment::class;

    public function definition()
    {
        return [
            'order_id' => Order::factory()->create(),
        ];
    }
}
