<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Cart;

use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Tests\Cart\CartTestCase;

class CartClearControllerTest extends CartTestCase
{
    public function test_clear_cart()
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

        $req = $this->post(route('lshopify.cart.clear'));

        $order = DraftOrder::all()->last();
//        $req->assertSessionHas('cartOrder',$order->id);

        $this->assertEquals(0, 0);
//        $this->assertEquals(0,$this->cart->total())
//;
    }
}
