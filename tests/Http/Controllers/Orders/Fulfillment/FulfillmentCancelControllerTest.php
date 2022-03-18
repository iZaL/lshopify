<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Order\Fulfillment;

use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Models\Workflow;
use IZal\Lshopify\Tests\TestCase;

class FulfillmentCancelControllerTest extends TestCase
{
    public function test_can_cancel_fulfillment()
    {
        $variant1Qty = 10;
        $variant2Qty = 9;
        $variant3Qty = 8;

        $fulfill1Qty = 3; //7

        $order = Order::factory()->create();

        $variant1 = Variant::factory()->create();
        $variant2 = Variant::factory()->create();
        $variant3 = Variant::factory()->create();

        $order->variants()->attach($variant1->id, ['quantity' => $variant1Qty]);

        $orderWorkflows = $order->workflows();

        $fulfillmentWorkflow1 = $orderWorkflows->create(['type' => Workflow::TYPE_FULFILLMENT,'status' => Workflow::STATUS_SUCCESS]); // variant1
        $fulfillmentWorkflow1->variants()->attach($variant1,['quantity' => $fulfill1Qty]); //3

        $this->post(route('lshopify.orders.fulfillments.delete',[$order->id,$fulfillmentWorkflow1->id]),[
            'variants' => [
                $variant1->id => $variant1Qty,
                $variant2->id => $variant2Qty,
                $variant3->id => $variant3Qty,
            ]
        ]);

        $this->assertDatabaseHas('workflows', [
            'id' => $fulfillmentWorkflow1->id,
            'type' => Workflow::TYPE_FULFILLMENT,
            'status' => Workflow::STATUS_CANCELLED,
        ]);

        $this->assertDatabaseMissing('workflow_variants', [
            'workflow_id' => $fulfillmentWorkflow1->id,
            'variant_id' => $variant1->id,
            'quantity' => $fulfill1Qty,
        ]);
    }
}
