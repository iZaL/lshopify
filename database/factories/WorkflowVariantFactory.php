<?php

namespace IZal\Lshopify\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Models\Workflow;
use IZal\Lshopify\Models\WorkflowVariant;

class WorkflowVariantFactory extends Factory
{
    protected $model = WorkflowVariant::class;

    public function definition()
    {
        return [
            'workflow_id' => Workflow::factory()->create(),
            'variant_id' => Variant::factory()->create(),
            'price' => 100,
            'unit_price' => 100,
            'total' => 100,
            'subtotal' => 100,
            'quantity' => 1,
        ];
    }
}
