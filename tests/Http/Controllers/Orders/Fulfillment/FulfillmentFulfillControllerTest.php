<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Order\Fulfillment;

use IZal\Lshopify\Models\Fulfillment;
use IZal\Lshopify\Models\FulfillmentVariant;
use IZal\Lshopify\Tests\TestCase;

class FulfillmentFulfillControllerTest extends TestCase
{
    public function test_can_fulfill_order()
    {
        $quantity1 = 5;
        $quantity2 = 8;
        $quantity3 = 2;
        $quantity4 = 1;

        $fulfillQuantity1 = 4;
        $fulfillQuantity2 = 6;
        $fulfillQuantity3 = 2;
        $fulfillQuantity4 = 0;

        $fulfillment = Fulfillment::factory()
            ->hasAttached(
                FulfillmentVariant::factory()->create(),
                [
                    'quantity' => $quantity1,
                    'price' => 100,
                    'unit_price' => 100,
                    'total' => 100,
                    'subtotal' => 100,
                ],
                'variants',
            )
            ->hasAttached(
                FulfillmentVariant::factory()->create(),
                [
                    'quantity' => $quantity2,
                    'price' => 100,
                    'unit_price' => 100,
                    'total' => 100,
                    'subtotal' => 100,
                ],
                'variants'
            )
            ->hasAttached(
                FulfillmentVariant::factory()->create(),
                [
                    'quantity' => $quantity3,
                    'price' => 100,
                    'unit_price' => 100,
                    'total' => 100,
                    'subtotal' => 100,
                ],
                'variants'
            )
            ->hasAttached(
                FulfillmentVariant::factory()->create(),
                [
                    'quantity' => $quantity4,
                    'price' => 100,
                    'unit_price' => 100,
                    'total' => 100,
                    'subtotal' => 100,
                ],
                'variants'
            )
            ->create();

        $variants = $fulfillment->variants;

        $variant1 = $variants[0];
        $variant2 = $variants[1];
        $variant3 = $variants[2];
        $variant4 = $variants[3];

        $postData = [
            'variants' => [
                [
                    'id' => $variant1->id,
                    'pivot_quantity' => $fulfillQuantity1, // remaining 1
                ],
                [
                    'id' => $variant2->id,
                    'pivot_quantity' => $fulfillQuantity2, // remaining 2
                ],
                [
                    'id' => $variant3->id,
                    'pivot_quantity' =>$fulfillQuantity3, // remaining 0
                ],
                [
                    'id' => $variant4->id,
                    'pivot_quantity' => $fulfillQuantity4, // remaining 1
                ],
            ],
        ];

        $req = $this->post(route('lshopify.orders.fulfill', [$fulfillment->order->id, $fulfillment->id]), $postData);

        $this->assertDatabaseHas('fulfillment_variants', ['fulfillment_id' => $fulfillment->id, 'variant_id' => $variant1->id, 'quantity' => $quantity1 - $fulfillQuantity1, 'status' => 'pending']);
        $this->assertDatabaseHas('fulfillment_variants', ['fulfillment_id' => $fulfillment->id, 'variant_id' => $variant2->id, 'quantity' => $quantity2 - $fulfillQuantity2, 'status' => 'pending']);
        $this->assertDatabaseHas('fulfillment_variants', ['fulfillment_id' => $fulfillment->id, 'variant_id' => $variant4->id, 'quantity' => $quantity4 - $fulfillQuantity4, 'status' => 'pending']);
        $this->assertDatabaseMissing('fulfillment_variants', ['fulfillment_id' => $fulfillment->id, 'variant_id' => $variant3->id, 'status' => 'pending']);

        $newFulfillment = Fulfillment::all()->last();

        $this->assertDatabaseHas('fulfillments', ['id' => $newFulfillment->id]);

        $this->assertNotEquals($fulfillment->id, $newFulfillment->id);

        $this->assertDatabaseHas('fulfillment_variants', ['fulfillment_id' => $newFulfillment->id, 'variant_id' => $variant1->id, 'quantity' => $fulfillQuantity1, 'status' => 'success']);
        $this->assertDatabaseHas('fulfillment_variants', ['fulfillment_id' => $newFulfillment->id, 'variant_id' => $variant2->id, 'quantity' => $fulfillQuantity2, 'status' => 'success']);
        $this->assertDatabaseHas('fulfillment_variants', ['fulfillment_id' => $newFulfillment->id, 'variant_id' => $variant3->id, 'quantity' => $fulfillQuantity3, 'status' => 'success']);
    }
}
