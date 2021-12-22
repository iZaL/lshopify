<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Cart;

use IZal\Lshopify\Models\OrderVariant;
use IZal\Lshopify\Tests\Cart\CartTestCase;

class CartUpdateControllerTest extends CartTestCase
{
    public function test_cart_can_update_item()
    {
        $itemBeforeUpdate = [
            'id' => 1,
            'name' => 'MX / A / H',
            'quantity' => 2,
            'price' => 200,
            'unit_price' => 180,
            'subtotal' => 400,
            'total' => 360,
        ];

        $itemAfterUpdate = [
            'id' => 1,
            'quantity' => 4,
        ];

        $cartItem = $this->cart->add($itemBeforeUpdate);

        $req = $this->post(route('lshopify.cart.update'), ['rowId' => $cartItem->rowId, 'item' => $itemAfterUpdate]);

        $this->assertEquals(4, $this->cart->quantity());
    }

    public function test_cart_can_update_order_item()
    {
        $itemBeforeUpdate = [
            'id' => 1,
            'name' => 'MX / A / H',
            'quantity' => 2,
            'price' => 200,
            'unit_price' => 180,
            'subtotal' => 400,
            'total' => 360,
        ];

        $cartItem = $this->cart->add($itemBeforeUpdate);

        $orderVariant = OrderVariant::factory()->create(
            [
                'price' => $cartItem->price(),
                'unit_price' => $cartItem->unit_price(),
                'total' => $cartItem->total(),
                'subtotal' => $cartItem->subtotal(),
                'quantity' => $cartItem->quantity(),
            ]
        );

        $itemAfterUpdate = [
            'id' => $orderVariant->variant->id,
            'quantity' => 4,
        ];

        $this->assertEquals(2, $this->cart->quantity());

        $req = $this->post(route('lshopify.cart.update'), ['rowId' => $cartItem->rowId, 'item' => $itemAfterUpdate, 'orderID' => $orderVariant->order->id]);

        $this->assertEquals(4, $this->cart->quantity());

//        $this->assertDatabaseHas('order_variants',['order_id' => $orderVariant->order->id, 'variant_id' => $orderVariant->variant->id,'quantity' => 4]);
    }
}
