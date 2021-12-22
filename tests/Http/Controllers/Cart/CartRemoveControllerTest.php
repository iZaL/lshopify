<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Cart;

use IZal\Lshopify\Models\OrderVariant;
use IZal\Lshopify\Tests\Cart\CartTestCase;

class CartRemoveControllerTest extends CartTestCase
{
    public function test_cart_can_remove_item()
    {
        $item = [
            'id' => 1,
            'name' => 'MX / A / H',
            'quantity' => 2,
            'price' => 200,
            'unit_price' => 180,
            'subtotal' => 400,
            'total' => 360,
        ];

        $cartItem = $this->cart->add($item);

        $req = $this->post(route('lshopify.cart.remove'), ['rowId' => $cartItem->rowId]);

        $this->assertEquals(0, $this->cart->items()->count());
    }

    public function test_cart_can_remove_order_item()
    {
        $item = [
            'id' => 1,
            'name' => 'MX / A / H',
            'quantity' => 2,
            'price' => 200,
            'unit_price' => 180,
            'subtotal' => 400,
            'total' => 360,
        ];

        $cartItem = $this->cart->add($item);

        $orderVariant = OrderVariant::factory()->create(
            [
                'price' => $cartItem->price(),
                'unit_price' => $cartItem->unit_price(),
                'total' => $cartItem->total(),
                'subtotal' => $cartItem->subtotal(),
                'quantity' => $cartItem->quantity(),
            ]
        );

        $req = $this->post(route('lshopify.cart.remove'), ['rowId' => $cartItem->rowId, 'orderID' => $orderVariant->order->id]);

        $this->assertEquals(0, $this->cart->items()->count());
//        $this->assertDatabaseHas('orders',['id' => $orderVariant->order->id, 'total' => 0, 'subtotal' => 0]);
//        $this->assertDatabaseMissing('order_variants',['id' => $orderVariant->id]);
    }
}
