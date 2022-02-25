<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Order\Transaction;

use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\OrderVariant;
use IZal\Lshopify\Tests\TestCase;

class RefundControllerTest extends TestCase
{
    public function test_can_restock_items()
    {
        $quantity1 = 5;
        $quantity2 = 8;
        $quantity3 = 2;
        $quantity4 = 1;

        $fulfillQuantity1 = 4;
        $fulfillQuantity2 = 6;
        $fulfillQuantity3 = 2;
        $fulfillQuantity4 = 0;

        $order = Order::factory()
             ->hasAttached(
                 OrderVariant::factory()->create(),
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
                OrderVariant::factory()->create(),
                [
                    'quantity' => $quantity2,
                    'price' => 100,
                    'unit_price' => 100,
                    'total' => 100,
                    'subtotal' => 100,
                ],
                'variants',
            )
            ->hasAttached(
                OrderVariant::factory()->create(),
                [
                    'quantity' => $quantity3,
                    'price' => 100,
                    'unit_price' => 100,
                    'total' => 100,
                    'subtotal' => 100,
                ],
                'variants',
            )
            ->hasAttached(
                OrderVariant::factory()->create(),
                [
                    'quantity' => $quantity4,
                    'price' => 100,
                    'unit_price' => 100,
                    'total' => 100,
                    'subtotal' => 100,
                ],
                'variants',
            )
            ->create();

        $variants = $order->variants;

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
            'restock' => 1,
        ];

        $req = $this->post(route('lshopify.orders.refund', $order->id), $postData);

//        $this->assertDatabaseHas('order_variants', ['order_id' => $order->id, 'variant_id' => $variant1->id, 'quantity' => $quantity1 - $fulfillQuantity1]);
//        $this->assertDatabaseHas('order_variants', ['order_id' => $order->id, 'variant_id' => $variant2->id, 'quantity' => $quantity2 - $fulfillQuantity2]);
//        $this->assertDatabaseMissing('order_variants', ['order_id' => $order->id, 'variant_id' => $variant3->id]);
//        $this->assertDatabaseHas('order_variants', ['order_id' => $order->id, 'variant_id' => $variant4->id, 'quantity' => $quantity4 - $fulfillQuantity4]);

//        $this->assertDatabaseHas('order_returns', ['order_id' => $order->id, 'variant_id' => $variant1->id, 'quantity' => $fulfillQuantity1]);
//        $this->assertDatabaseHas('order_returns', ['order_id' => $order->id, 'variant_id' => $variant2->id, 'quantity' => $fulfillQuantity2]);
//        $this->assertDatabaseHas('order_returns', ['order_id' => $order->id, 'variant_id' => $variant3->id, 'quantity' => $fulfillQuantity3]);
//        $this->assertDatabaseMissing('order_returns', ['order_id' => $order->id, 'variant_id' => $variant4->id]);

        // check restocked
//        $this->assertDatabaseHas('variants', ['id' => $variant1->id, 'quantity' => $variant1->quantity + $fulfillQuantity1]);
    }
}
