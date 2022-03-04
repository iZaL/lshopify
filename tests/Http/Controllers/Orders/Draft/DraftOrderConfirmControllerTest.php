<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Orders\Draft;

use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Models\Fulfillment;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Tests\TestCase;

class DraftOrderConfirmControllerTest extends TestCase
{
    public function test_confirm_draft_order()
    {
        $price1 = 200;
        $price1quantity = 2;
        $price1Total = $price1 * $price1quantity;

        $price2 = 100;
        $price2quantity = 1;
        $price2Total = $price2 * $price2quantity;

        $draftOrder = DraftOrder::factory()
            ->hasAttached(
                Variant::factory()->count(1),
                [
                    'price' => $price1,
                    'unit_price' => $price1,
                    'total' => $price1Total,
                    'subtotal' => $price1Total,
                    'quantity' => $price1quantity,
                ]
            )
            ->hasAttached(
                Variant::factory()->count(1),
                [
                    'price' => $price2,
                    'unit_price' => $price2,
                    'total' => $price2Total,
                    'subtotal' => $price2Total,
                    'quantity' => $price2quantity,
                ]
            )
            ->create();

        $this->post(route('lshopify.draft.orders.confirm', $draftOrder->id));

        $this->assertDatabaseHas('orders', ['id' => $draftOrder->id, 'draft' => 0]);
    }
}
