<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Cart;

use IZal\Lshopify\Cart\Condition;
use IZal\Lshopify\Tests\Cart\CartTestCase;

class CartDiscountRemoveControllerTest extends CartTestCase
{
    public function test_cart_can_remove_cart_discount()
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

        $discount = [
            'suffix' => 'percentage',
            'value' => '10',
            'reason' => 'VIP customer',
            'name' => '1',
            'type' => 'discount',
            'target' => 'subtotal',
        ];

        $this->cart->add($item);

        $condition = new Condition($discount);
        $condition->setActions([['value' => '-10%']]);
        $this->cart->condition($condition);

        $this->assertEquals(360, $this->cart->total());

        $this->post(route('lshopify.cart.discount.remove'), ['discount' => $discount]);

        $this->assertEquals(400, $this->cart->total());
    }

    public function test_cart_can_remove_item_discount()
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

        $discount = [
            'suffix' => 'amount',
            'value' => '10',
            'reason' => 'VVIP customer',
            'name' => 'cart',
            'type' => 'discount',
            'target' => 'subtotal',
        ];

        $cartItem = $this->cart->add($item);
        $condition = new Condition($discount);
        $condition->setActions([['value' => '-10']]);
        $this->cart->condition($condition);

        $this->assertEquals(390, $this->cart->total());

        $req = $this->post(route('lshopify.cart.discount.remove'), ['discount' => $discount, 'item' => array_merge($item, ['rowId' => $cartItem->rowId])]);

        $this->assertEquals(400, $this->cart->total());
    }
}
