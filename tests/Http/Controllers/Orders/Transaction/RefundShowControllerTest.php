<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Order\Transaction;

use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Tests\TestCase;

class RefundShowControllerTest extends TestCase
{
    public function test_can_get_edit_orders_page()
    {
        $order = Order::factory()->create();
        $response = $this->get(route('lshopify.orders.refund.show', $order->id));

        $response->assertInertia(
            fn ($assert) => $assert
                ->has('order')
                ->has('pending_fulfillments')
                ->has('fulfillments')
        );
    }
}
