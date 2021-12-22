<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Orders\Draft;

use IZal\Lshopify\Tests\TestCase;

class DraftOrderIndexControllerTest extends TestCase
{
    public function test_can_get_draft_order_index_page()
    {
        $response = $this->get(route('lshopify.orders.draft.index'));
        $response->assertInertia(
            fn ($assert) => $assert
            ->has('orders')
        );
    }
}
