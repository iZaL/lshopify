<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Orders\Draft;

use IZal\Lshopify\Tests\TestCase;

class DraftOrderCreateControllerTest extends TestCase
{
    public function test_can_get_draft_order_create_page()
    {
        $response = $this->get(route('lshopify.draft.orders.create'));
        $response->assertInertia(
            fn ($assert) => $assert
            ->has('products')
            ->has('cart')
        );
    }
}
