<?php

namespace IZal\Lshopify\Tests\Feature;

use IZal\Lshopify\Managers\WorkflowManager;
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
    public function test_get_unfulfilled_variants()
    {

        // create order with 3 variants
        $orderVariantQty1 = 5;
        $orderVariantQty2 = 3;
        $orderVariantQty3 = 1;

        $order = Order::factory()->create();

        $variant1 = Variant::factory()->create();
        $variant2 = Variant::factory()->create();
        $variant3 = Variant::factory()->create();

        $order->variants()->attach($variant1->id, ['quantity' => $orderVariantQty1]);
        $order->variants()->attach($variant2->id, ['quantity' => $orderVariantQty2]);
        $order->variants()->attach($variant3->id, ['quantity' => $orderVariantQty3]);

        // create order workflow
        $orderWorkflows = $order->workflows();

        $fulfillmentWorkflow1 = $orderWorkflows->create(['type' => 'fulfilled']);
        $refundWorkflow = $orderWorkflows->create(['type' => 'refund']);
        $fulfillmentWorkflow3 = $orderWorkflows->create(['type' => 'fulfilled']);

        $fulfillmentWorkflow1->variants()->attach($variant1,['quantity' => 2]); // 5-2 = 3
        $fulfillmentWorkflow3->variants()->attach($variant1,['quantity' => 1]); // 3-1 = 2
        $refundWorkflow->variants()->attach($variant1); // should exclude

        $workflowManager = new WorkflowManager($order);
        $unfulfilledVariants = $workflowManager->getUnfulfilledVariantsWithPivot();

        $firstUnfulfilledVariant = $unfulfilledVariants->firstWhere('id', $variant1->id);
        $secondUnfulfilledVariant = $unfulfilledVariants->firstWhere('id', $variant2->id);
        $thirdUnfulfilledVariant = $unfulfilledVariants->firstWhere('id', $variant3->id);

        $expectedFirstUnfulfilledVariant = ['id' => 1, 'quantity' => 2];
        $expectedSecondUnfulfilledVariant = ['id' => 2, 'quantity' => 3];
        $expectedThirdUnfulfilledVariant = ['id' => 3, 'quantity' => 1];

        $this->assertEquals($expectedFirstUnfulfilledVariant['id'], $firstUnfulfilledVariant->id);
        $this->assertEquals($expectedFirstUnfulfilledVariant['quantity'], $firstUnfulfilledVariant->pivot->quantity);

        $this->assertEquals($expectedSecondUnfulfilledVariant['id'], $secondUnfulfilledVariant->id);
        $this->assertEquals($expectedSecondUnfulfilledVariant['quantity'], $secondUnfulfilledVariant->pivot->quantity);

        $this->assertEquals($expectedThirdUnfulfilledVariant['id'], $thirdUnfulfilledVariant->id);
        $this->assertEquals($expectedThirdUnfulfilledVariant['quantity'], $thirdUnfulfilledVariant->pivot->quantity);


    }
    public function test_get_fulfilled_variants()
    {
        $variant1Qty = 10;
        $variant2Qty = 9;
        $variant3Qty = 8;

        $fulfill1Qty = 3; //7
        $fulfill2Qty = 2; //5
        $fulfill3Qty = 2;// 6
        $refundQty = 1; //4
        $removeQty = 1; //3

        $order = Order::factory()->create();

        $variant1 = Variant::factory()->create();
        $variant2 = Variant::factory()->create();
        $variant3 = Variant::factory()->create();

        $order->variants()->attach($variant1->id, ['quantity' => $variant1Qty]);
        $order->variants()->attach($variant2->id, ['quantity' => $variant2Qty]);
        $order->variants()->attach($variant3->id, ['quantity' => $variant3Qty]);

        $orderWorkflows = $order->workflows();

        $fulfillmentWorkflow1 = $orderWorkflows->create(['type' => 'fulfilled']); // variant1
        $fulfillmentWorkflow1->variants()->attach($variant1,['quantity' => $fulfill1Qty]); //3

        $fulfillmentWorkflow2 = $orderWorkflows->create(['type' => 'fulfilled']); // variant 1
        $fulfillmentWorkflow2->variants()->attach($variant1,['quantity' => $fulfill2Qty]); //3 + 2 = 5

        $refundWorkflow1 = $orderWorkflows->create(['type' => 'refund']);// variant 1
        $refundWorkflow1->variants()->attach($variant1,['quantity' => $refundQty]); //5 - 1 = 4
        $refundWorkflow1->variants()->attach($variant1,['quantity' => $refundQty]); //4 - 1 = 3

        $removeWorkflow1 = $orderWorkflows->create(['type' => 'removed']);// variant 1
        $removeWorkflow1->variants()->attach($variant1,['quantity' => $removeQty]); //should exclude

        $fulfillmentWorkflow3 = $orderWorkflows->create(['type' => 'fulfilled']); //  variant 2
        $fulfillmentWorkflow3->variants()->attach($variant2,['quantity' => $fulfill3Qty]); //2

        $fulfillmentWorkflow4 = $orderWorkflows->create(['type' => 'fulfilled']);// variant 3
        $fulfillmentWorkflow4->variants()->attach($variant3,['quantity' => $fulfill3Qty]); //2

        $workflowManager = new WorkflowManager($order);
        $fulfilledVariants = $workflowManager->getFulfilledVariantsWithPivot();

        $firstFulfilledVariant = $fulfilledVariants->firstWhere('id',$variant1->id);
        $secondFulfilledVariant = $fulfilledVariants->firstWhere('id', $variant2->id);
        $thirdFulfilledVariant = $fulfilledVariants->firstWhere('id', $variant3->id);

        $expectedFirstFilledVariant = ['id' => 1, 'quantity' => 3];
        $expectedSecondFulfilledVariant = ['id' => 2, 'quantity' => 2];
        $expectedThirdFulfilledVariant = ['id' => 3, 'quantity' => 2];

        $this->assertEquals($expectedFirstFilledVariant['id'], $firstFulfilledVariant->id);
        $this->assertEquals($expectedFirstFilledVariant['quantity'], $firstFulfilledVariant->pivot->quantity);

        $this->assertEquals($expectedSecondFulfilledVariant['id'], $secondFulfilledVariant->id);
        $this->assertEquals($expectedSecondFulfilledVariant['quantity'], $secondFulfilledVariant->pivot->quantity);
//
        $this->assertEquals($expectedThirdFulfilledVariant['id'], $thirdFulfilledVariant->id);
        $this->assertEquals($expectedThirdFulfilledVariant['quantity'], $thirdFulfilledVariant->pivot->quantity);

    }
}
