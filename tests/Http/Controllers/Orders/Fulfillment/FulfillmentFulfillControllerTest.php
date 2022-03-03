<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Order\Fulfillment;

use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\OrderVariant;
use IZal\Lshopify\Models\Workflow;
use IZal\Lshopify\Models\WorkflowVariant;
use IZal\Lshopify\Tests\TestCase;

class FulfillmentFulfillControllerTest extends TestCase
{
    public function test_can_fulfill_order()
    {
        $quantity1 = 5;
        $quantity2 = 8;
        $quantity3 = 2;
        $quantity4 = 1;

        $fulfillQuantity1 = 4;
        $fulfillQuantity2 = 6;
        $fulfillQuantity3 = 2;
        $fulfillQuantity4 = 0;

        $order = Order::factory()
            ->hasAttached(
                OrderVariant::factory()->create(),
                [
                    'quantity' => $quantity1,
                    'price' => 100,
                    'unit_price' => 100,
                    'total' => 100,
                    'subtotal' => 100,
                ],
                'variants',
            )
            ->hasAttached(
                OrderVariant::factory()->create(),
                [
                    'quantity' => $quantity2,
                    'price' => 100,
                    'unit_price' => 100,
                    'total' => 100,
                    'subtotal' => 100,
                ],
                'variants'
            )
            ->hasAttached(
                OrderVariant::factory()->create(),
                [
                    'quantity' => $quantity3,
                    'price' => 100,
                    'unit_price' => 100,
                    'total' => 100,
                    'subtotal' => 100,
                ],
                'variants'
            )
            ->hasAttached(
                OrderVariant::factory()->create(),
                [
                    'quantity' => $quantity4,
                    'price' => 100,
                    'unit_price' => 100,
                    'total' => 100,
                    'subtotal' => 100,
                ],
                'variants'
            )
            ->create();

        $orderVariants = $order->variants;

        $variant1 = $orderVariants[0];
        $variant2 = $orderVariants[1];
        $variant3 = $orderVariants[2];
        $variant4 = $orderVariants[3];

        $postData = [
            'variants' => [
                [
                    'id' => $variant1->id,
                    'pivot_quantity' => $fulfillQuantity1, // remaining 1
                ],
                [
                    'id' => $variant2->id,
                    'pivot_quantity' => $fulfillQuantity2, // remaining 2
                ],
                [
                    'id' => $variant3->id,
                    'pivot_quantity' =>$fulfillQuantity3, // remaining 0
                ],
                [
                    'id' => $variant4->id,
                    'pivot_quantity' => $fulfillQuantity4, // remaining 1
                ],
            ],
        ];

        $req = $this->post(route('lshopify.orders.fulfillments', [$order->id]), $postData);

        $workflow = Workflow::all()->last();

        $this->assertDatabaseHas('workflows', ['id' => $workflow->id,'type' => 'fulfilled']);

        $this->assertDatabaseHas('workflow_variants', ['workflow_id' => $workflow->id, 'variant_id' => $variant1->id, 'quantity' => $fulfillQuantity1]);
        $this->assertDatabaseHas('workflow_variants', ['workflow_id' => $workflow->id, 'variant_id' => $variant2->id, 'quantity' => $fulfillQuantity2]);
        $this->assertDatabaseHas('workflow_variants', ['workflow_id' => $workflow->id, 'variant_id' => $variant3->id, 'quantity' => $fulfillQuantity3]);
    }
}
