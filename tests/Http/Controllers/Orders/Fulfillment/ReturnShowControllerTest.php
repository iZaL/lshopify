<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Order\Fulfillment;

use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Tests\TestCase;

class ReturnShowControllerTest extends TestCase
{
    public function test_can_get_order_return_page()
    {
        $order = Order::factory()->create();
        $response = $this->get(route('lshopify.orders.return', $order->id));

        $response->assertInertia(
            fn ($assert) => $assert
                ->has('order')
        );
    }
}
