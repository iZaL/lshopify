<?php

namespace IZal\Lshopify\Database\Factories;

use Illuminate\Support\Str;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\Discount;
use IZal\Lshopify\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;

class DiscountFactory extends Factory
{
    protected $model = Discount::class;

    public function definition()
    {
        return [
            'name' => Str::upper(Str::random(8)),
            'type' => 'code',
            'value' => 300,
            'value_type' => 'percent',
            'target_type' => 'all_products',
            'min_requirement_type' => null,
            'min_requirement_value' => 0,
            'once_per_customer' => false,
            'usage_limit' => null,
            'customer_selection' => 'all',
        ];
    }
}
