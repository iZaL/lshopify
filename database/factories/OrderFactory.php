<?php

namespace IZal\Lshopify\Database\Factories;

use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition()
    {
        return [
            'customer_id' => Customer::factory()->create(),
            'total' => rand(100, 200),
            'subtotal' => rand(100, 200),
            'draft' => 0,
            'status' => 'open',
        ];
    }
}
