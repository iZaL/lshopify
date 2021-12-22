<?php

namespace IZal\Lshopify\Tests\Cart\Crud;

use IZal\Lshopify\Tests\Cart\CartTestCase;

class Reading extends CartTestCase
{
    /** @test */
    public function it_can_get_an_item_information()
    {
        $item1 = $this->createItem('Foobar 1', 97, 4);
        $item2 = $this->createItem('Foobar 2', 21, 2);

        $this->cart->add([$item1, $item2]);

        $this->assertSame($this->cart->item('b37f673e46a33038305c1dc411215c07')->get('price'), 97.00);
    }

    /** @test */
    public function it_can_get_an_item_subtotal()
    {
        $item = $this->createItem('Foobar 1', 97, 4);
        $item = $this->cart->add($item);

        $this->assertSame($item->subtotal(), 388.00);
    }

    /** @test */
    public function it_can_get_an_item_total()
    {
        $item = $this->createItem('Foobar 1', 97, 5);
        $item = $this->cart->add($item);

        $this->assertSame($item->total(), 485.00);
    }

    /** @test */
    public function it_can_get_an_item_quantity()
    {
        $item = $this->createItem('Foobar 1', 97, 4);
        $item = $this->cart->add($item);

        $this->assertSame($item->quantity(), 4);
    }

    /** @test */
    public function it_can_get_an_item_weight()
    {
        $item = $this->createItem('Foobar 1', 97, 4, null, null, 21.00);
        $item = $this->cart->add($item);

        $this->assertSame($item->weight(), 84.00);
    }
}
