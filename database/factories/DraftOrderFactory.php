<?php

namespace IZal\Lshopify\Database\Factories;

use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\DraftOrder;
use Illuminate\Database\Eloquent\Factories\Factory;

class DraftOrderFactory extends Factory
{
    protected $model = DraftOrder::class;

    public function definition()
    {
        return [
            'customer_id' => Customer::factory()->create(),
            'total' => rand(100, 200),
            'subtotal' => rand(100, 200),
            'draft' => 1,
        ];
    }

    public function draft()
    {
        return $this->state(function (array $attributes) {
            return [
                'draft' => 1,
            ];
        });
    }
}
