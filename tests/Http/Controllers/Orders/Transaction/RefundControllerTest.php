<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Order\Transaction;

use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\OrderVariant;
use IZal\Lshopify\Models\Workflow;
use IZal\Lshopify\Models\WorkflowVariant;
use IZal\Lshopify\Tests\TestCase;

class RefundControllerTest extends TestCase
{
    public function test_can_refund_items()
    {
        $quantity = 10;
        $fulfillQuantity = 8;

        $order = Order::factory()->create();
        $variant1 = OrderVariant::factory()->create(['order_id' => $order->id, 'quantity' => $quantity]);
        $variant2 = OrderVariant::factory()->create(['order_id' => $order->id, 'quantity' => $quantity]);
        $variant3 = OrderVariant::factory()->create(['order_id' => $order->id, 'quantity' => $quantity]);
        $variant4 = OrderVariant::factory()->create(['order_id' => $order->id, 'quantity' => $quantity]);

        // pending fulfillments

        $variants = $order->variants;

        $workflow = $order->workflows();
        $workflow1 = $workflow->create(['type'=>Workflow::TYPE_FULFILLMENT, 'status'=>Workflow::STATUS_SUCCESS]);
        $workflow1->variants()->attach($variant1->id, ['quantity'=>$fulfillQuantity]);

        $workflow2 = $workflow->create(['type'=>Workflow::TYPE_FULFILLMENT, 'status'=>Workflow::STATUS_SUCCESS]);
        $workflow2->variants()->attach($variant2->id, ['quantity'=>$fulfillQuantity]);

        // variant 1,variant 1 fulfilled
        // variant 3,variant 4 unfulfilled

        $postData = [
            'fulfillments' => [
                [
                    'id' => $variant1->variant_id,
                    'pivot_quantity' => $fulfillQuantity - 1,
                ],
                [
                    'id' => $variant2->id,
                    'pivot_quantity' => $fulfillQuantity - 2,
                ],
            ],
            'pending_fulfillments' => [
                [
                    'id' => $variant3->id,
                    'pivot_quantity' =>$fulfillQuantity - 3,
                ],
                [
                    'id' => $variant4->id,
                    'pivot_quantity' => $fulfillQuantity - 4,
                ],
            ],
            'restock' => 1,
        ];

        $req = $this->post(route('lshopify.orders.refund', $order->id), $postData);

        $workflowVariant1 = WorkflowVariant::where('variant_id', $variant1->id)->where('quantity', $fulfillQuantity - 1)->first();
        $workflowVariant2 = WorkflowVariant::where('variant_id', $variant2->id)->where('quantity', $fulfillQuantity - 2)->first();
        $workflowVariant3 = WorkflowVariant::where('variant_id', $variant3->id)->where('quantity', $fulfillQuantity - 3)->first();
        $workflowVariant4 = WorkflowVariant::where('variant_id', $variant4->id)->where('quantity', $fulfillQuantity - 4)->first();

        $this->assertDatabaseHas('workflow_variants', [
            'variant_id' => $workflowVariant1->variant_id,
            'quantity' => $workflowVariant1->quantity,
        ]);


        $this->assertDatabaseHas('workflow_variants', [
            'variant_id' => $workflowVariant2->variant_id,
            'quantity' => $workflowVariant2->quantity,
        ]);

        $this->assertDatabaseHas('workflow_variants', [
            'variant_id' => $workflowVariant3->variant_id,
            'quantity' => $workflowVariant3->quantity,
        ]);

        $this->assertDatabaseHas('workflow_variants', [
            'variant_id' => $workflowVariant4->variant_id,
            'quantity' => $workflowVariant4->quantity,
        ]);

        $this->assertEquals($workflowVariant1->workflow->type, Workflow::TYPE_REFUND);
        $this->assertEquals($workflowVariant2->workflow->type, Workflow::TYPE_REFUND);
        $this->assertEquals($workflowVariant3->workflow->type, Workflow::TYPE_REMOVED);
        $this->assertEquals($workflowVariant4->workflow->type, Workflow::TYPE_REMOVED);

    }
}
