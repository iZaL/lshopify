<?php

namespace IZal\Lshopify\Tests\Cart\Crud;

use IZal\Lshopify\Tests\Cart\CartTestCase;

class Updating extends CartTestCase
{
    /** @test */
    public function it_can_update_an_item_quantity()
    {
        $item = $this->createItem('Foobar 1', 10, 5);

        $item = $this->cart->add($item);

        $this->assertSame($item->get('quantity'), 5);

        $this->cart->update('b37f673e46a33038305c1dc411215c07', ['quantity' => 2]);

        $this->assertSame($item->get('quantity'), 2);
    }

    /** @test */
    public function it_can_remove_an_item_with_negative_quantity_test_1()
    {
        $item = $this->createItem('Foobar 1', 10, 5);

        $item = $this->cart->add($item);

        $this->assertSame($item->get('quantity'), 5);

        $this->cart->update('b37f673e46a33038305c1dc411215c07', ['quantity' => -1]);

        $this->assertSame($this->cart->quantity(), 0);
    }

    /** @test */
    public function it_can_remove_an_item_with_negative_quantity_test_2()
    {
        $item = $this->createItem('Foobar 1', 10, 5);

        $item = $this->cart->add($item);

        $this->assertSame($item->get('quantity'), 5);

        $this->cart->update('b37f673e46a33038305c1dc411215c07', [
            'quantity' => -1,
        ]);

        $this->assertSame($this->cart->quantity(), 0);
    }

    /** @test */
    public function it_can_update_an_item_attributes()
    {
        $item = $this->createItem('Foobar 1', 120, 3, null, [15.00, 0]);

        $item = $this->cart->add($item);

        $this->assertSame($item->get('quantity'), 3);
        $this->assertSame($item->get('name'), 'Foobar 1');
        $this->assertSame($item->get('attributes')->first()->get('value'), 'l');

        $this->cart->update('1fd8cf79422961bc6ef110eea0d47edc', [
            'name'       => 'Foo',
            'quantity'   => 6,
            'attributes' => [
                'size' => [
                    'label' => 'Medium',
                    'value' => 'm',
                    'price' => 15.00,
                ],
            ],
        ]);

        $this->assertSame($item->get('quantity'), 6);
        $this->assertSame($item->get('name'), 'Foo');
        $this->assertSame($item->get('attributes')->first()->get('value'), 'm');
    }

    /** @test */
    public function it_can_update_multiple_items_quantity_prices_and_attributes()
    {
        $item1 = $this->createItem('Foobar 1', 120, 7, null, [15.00, 0]);
        $item2 = $this->createItem('Foobar 2', 150, 3, null, [15.00, 0]);

        $items = $this->cart->add([$item1, $item2]);

        $item1 = $items[0];
        $item2 = $items[1];

        $this->assertSame($item1->get('quantity'), 7);
        $this->assertSame($item1->get('price'), 120.00);
        $this->assertSame($item1->get('attributes')->first()->get('label'), 'Large');

        $this->assertSame($item2->get('price'), 150.00);
        $this->assertSame($item2->get('quantity'), 3);
        $this->assertSame($item2->get('attributes')->last()->get('label'), 'Red');

        $this->cart->update([
            '1fd8cf79422961bc6ef110eea0d47edc' => [
                'price'    => 20.00,
                'quantity' => 3,
            ],
            '44fd12480508f49e6642c1b49d57d702' => [
                'price'      => 25.00,
                'quantity'   => 2,
                'attributes' => [
                    'size' => [
                        'label' => 'Medium',
                        'value' => 'm',
                        'price' => 15.00,
                    ],
                ],
            ],
        ]);

        $this->assertSame($item1->get('quantity'), 3);
        $this->assertSame($item1->get('price'), 20.00);
        $this->assertSame($item1->get('attributes')->first()->get('label'), 'Large');

        $this->assertSame($item2->get('price'), 25.00);
        $this->assertSame($item2->get('quantity'), 2);
        $this->assertSame($item2->get('attributes')->first()->get('label'), 'Medium');
    }
}
