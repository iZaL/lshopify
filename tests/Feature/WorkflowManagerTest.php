<?php

namespace IZal\Lshopify\Tests\Feature;

use IZal\Lshopify\Managers\WorkflowManager;
use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Models\Fulfillment;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Tests\TestCase;

class WorkflowManagerTest extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function test_get_pending_variants()
    {
        $variant1Qty = 5;
        $variant2Qty = 3;
        $variant3Qty = 1;

        $order = Order::factory()->create();

        $variant1 = Variant::factory()->create();
        $variant2 = Variant::factory()->create();
        $variant3 = Variant::factory()->create();

        $order->variants()->attach($variant1->id, ['quantity' => $variant1Qty]);
        $order->variants()->attach($variant2->id, ['quantity' => $variant2Qty]);
        $order->variants()->attach($variant3->id, ['quantity' => $variant3Qty]);

        $orderWorkflows = $order->workflows();

        $fulfillmentWorkflow = $orderWorkflows->create(['type' => 'fulfill']);
        $fulfillmentWorkflow1 = $orderWorkflows->create(['type' => 'refund']);
        $fulfillmentWorkflow2 = $orderWorkflows->create(['type' => 'fulfill']);

        $fulfillmentWorkflow->variants()->attach($variant1);
        $fulfillmentWorkflow1->variants()->attach($variant1);
        $fulfillmentWorkflow2->variants()->attach($variant1);

        $workflowManager = new WorkflowManager($order);
        $unfulfilledVariants = $workflowManager->getUnfulfilledVariants();

        $expectedUnfulfilledVariants = [
            ['variant_id' => $variant1->id, 'quantity' => 2],
            ['variant_id' => $variant2->id, 'quantity' => 3],
            ['variant_id' => $variant3->id, 'quantity' => 1],
        ];

        $this->assertEquals($expectedUnfulfilledVariants, $unfulfilledVariants);

    }
}
