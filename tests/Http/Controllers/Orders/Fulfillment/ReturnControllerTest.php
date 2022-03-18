<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Order\Fulfillment;

use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\OrderVariant;
use IZal\Lshopify\Models\Workflow;
use IZal\Lshopify\Tests\TestCase;

class ReturnControllerTest extends TestCase
{
    public function test_can_get_order_return_page()
    {
        $order = Order::factory()->create();

        $quantity = 10;
        $fulfillQuantity = 8;

        $order = Order::factory()->create();
        $variant1 = OrderVariant::factory()->create(['order_id' => $order->id, 'quantity' => $quantity]);
        $variant2 = OrderVariant::factory()->create(['order_id' => $order->id, 'quantity' => $quantity]);

        $workflow = $order->workflows();
        $workflow1 = $workflow->create(['type'=>Workflow::TYPE_FULFILLMENT, 'status'=>Workflow::STATUS_SUCCESS]);
        $workflow1->variants()->attach($variant1->id, ['quantity'=>$fulfillQuantity]);

        $workflow2 = $workflow->create(['type'=>Workflow::TYPE_FULFILLMENT, 'status'=>Workflow::STATUS_SUCCESS]);
        $workflow2->variants()->attach($variant2->id, ['quantity'=>$fulfillQuantity]);

        $refundQuantity = $fulfillQuantity - 1;

        $payload = [
            'fulfillments' => [[
                'id' => $workflow1->id,
                'variants' => [
                    [
                        'id' => $variant1->id,
                        'pivot_quantity' => $refundQuantity,
                    ],
                ],
            ]
        ]];

        $request = $this->post(route('lshopify.orders.return.store', $order->id), $payload);

        $this->assertDatabaseHas('workflows', [
            'type' => Workflow::TYPE_RETURNED,
            'status' => Workflow::STATUS_PENDING,
            'order_id' => $order->id,
        ]);

        $workflow = $order->workflows()->where('type', Workflow::TYPE_RETURNED)->get()->last();

//        $this->assertDatabaseHas('workflow_variants', [
//            'variant_id' => $variant1->id,
//            'quantity' => $refundQuantity,
//        ]);


        $this->assertDatabaseHas('workflow_variants', [
            'workflow_id' => $workflow1->id,
            'variant_id' => $variant1->id,
            'quantity' => $fulfillQuantity - $refundQuantity,
        ]);

        $this->assertDatabaseHas('workflow_variants', [
            'workflow_id' => $workflow->id,
            'variant_id' => $variant1->id,
            'quantity' => $refundQuantity,
        ]);

    }
}
