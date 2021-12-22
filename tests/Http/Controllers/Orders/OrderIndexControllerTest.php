<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Orders;

use IZal\Lshopify\Tests\TestCase;

class OrderIndexControllerTest extends TestCase
{
    public function test_can_get_edit_orders_page()
    {
        $response = $this->get(route('lshopify.orders.index'));
        $response->assertInertia(
            fn ($assert) => $assert
                ->has('orders')
        );
    }
}
