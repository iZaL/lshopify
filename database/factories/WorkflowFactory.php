<?php

namespace IZal\Lshopify\Database\Factories;

use IZal\Lshopify\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use IZal\Lshopify\Models\Workflow;

class WorkflowFactory extends Factory
{
    protected $model = Workflow::class;

    public function definition()
    {
        return [
            'order_id' => Order::factory()->create(),
            'type' => Workflow::TYPE_FULFILLMENT
        ];
    }
}
