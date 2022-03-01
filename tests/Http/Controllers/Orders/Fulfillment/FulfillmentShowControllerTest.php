<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Order\Fulfillment;

use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Tests\TestCase;

class FulfillmentShowControllerTest extends TestCase
{
    public function test_can_get_fulfillment_page()
    {
        $order = Order::factory()->create();
        $response = $this->get(route('lshopify.orders.fulfill', $order->id));

        $response->assertInertia(
            fn ($assert) => $assert
                ->has('order')
                ->has('pending_fulfillments')
                ->has('customers')
        );
    }
}
