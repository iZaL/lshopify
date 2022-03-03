<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Order\Fulfillment;

use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\OrderVariant;
use IZal\Lshopify\Models\Workflow;
use IZal\Lshopify\Tests\TestCase;

class ReturnEditControllerTest extends TestCase
{
    public function test_can_edit_return_fulfillments()
    {
        $order = Order::factory()->create();

        $quantity = 10;
        $fulfillQuantity = 8;

        $order = Order::factory()->create();
        $variant1 = OrderVariant::factory()->create(['order_id' => $order->id, 'quantity' => $quantity]);

        $workflow = $order->workflows();
        $workflow1 = $workflow->create(['type'=>Workflow::TYPE_RETURNED, 'status'=>Workflow::STATUS_PENDING]);

        $payload = [
            'status' => 'success'
        ];

        $request = $this->post(route('lshopify.orders.return.edit', [$order->id,$workflow1->id]), $payload);

        $this->assertDatabaseHas('workflows', [
            'type' => Workflow::TYPE_RETURNED,
            'status' => Workflow::STATUS_SUCCESS,
            'order_id' => $order->id,
        ]);

    }
}
