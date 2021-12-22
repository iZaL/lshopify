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

        $this->post(route('lshopify.orders.draft.confirm', $draftOrder->id));

        $fulfillment = Fulfillment::all()->last();
        $variant1 = Variant::first();
        $variant2 = Variant::all()->last();

        $this->assertDatabaseHas('orders', ['id' => $draftOrder->id, 'draft' => 0]);

        $this->assertDatabaseHas('fulfillments', [
            'order_id' => $draftOrder->id,
        ]);

        $this->assertDatabaseHas('fulfillment_variants', ['fulfillment_id' => $fulfillment->id, 'variant_id' => $variant1->id, 'quantity' => $price1quantity, 'price' => $price1, 'unit_price' => $price1, 'total' => $price1Total, 'subtotal' => $price1Total, 'status' => 'pending']);
        $this->assertDatabaseHas('fulfillment_variants', ['fulfillment_id' => $fulfillment->id, 'variant_id' => $variant2->id, 'quantity' => $price2quantity, 'price' => $price2, 'unit_price' => $price2, 'total' => $price2Total, 'subtotal' => $price2Total, 'status' => 'pending']);
    }
}
