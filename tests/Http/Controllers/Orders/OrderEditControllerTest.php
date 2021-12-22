<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Orders;

use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Tests\TestCase;

class OrderEditControllerTest extends TestCase
{
    public function test_can_get_edit_orders_page()
    {
        $order = Order::factory()->create();
        $response = $this->get(route('lshopify.orders.show', $order->id));
        $response->assertInertia(
            fn ($assert) => $assert
                ->has('order')
        );
    }
}
