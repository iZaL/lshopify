<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Orders\Draft;

use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Tests\TestCase;

class DraftOrderEditControllerTest extends TestCase
{
    public function test_can_get_drat_order_edit_page()
    {
        $order = DraftOrder::factory()->create();
        $response = $this->get(route('lshopify.draft.orders.edit', $order->id));
        $response->assertInertia(
            fn ($assert) => $assert
            ->has('products')
            ->has('cart')
            ->has('customers')
            ->has('order')
        );
    }
}
