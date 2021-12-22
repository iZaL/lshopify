<?php

namespace IZal\Lshopify\Tests\Cart\Crud;

use IZal\Lshopify\Cart\Collection;
use IZal\Lshopify\Tests\Cart\CartTestCase;

class Adding extends CartTestCase
{
    /** @test */
    public function it_can_add_a_single_item()
    {
        $item = $this->createItem('Foobar 1', 10.00, 2);

        $this->cart->add($item);

        $this->assertSame($this->cart->quantity(), 2);

        $this->assertCount(1, $this->cart->items());
    }

    /** @test */
    public function it_can_add_a_free_item()
    {
        $item = $this->createItem('Foobar 1', 0);

        $this->cart->add($item);

        $this->assertSame($this->cart->quantity(), 1);

        $this->assertCount(1, $this->cart->items());
    }

    /** @test */
    public function it_can_add_a_single_item_with_quantity_as_string()
    {
        $item = $this->createItem('Foobar 1', 10.00, '0000002');

        $this->cart->add($item);

        $this->assertSame($this->cart->quantity(), 2);
    }

    /** @test */
    public function it_can_add_a_single_item_with_price_as_string()
    {
        $item = $this->createItem('Foobar 1', '10.00', 2.00);

        $item = $this->cart->add($item);

        $this->assertSame($item->get('price'), 10.00);
    }

    /** @test */
    public function it_can_add_a_single_item_with_attributes()
    {
        $item = $this->cart->add(
            $this->createItem('Foobar 1', 125, 2, null, [5, 3.5])
        );

        $this->assertCount(2, $item->attributes());
        $this->assertSame(125.00, $item->price());
        $this->assertSame(133.50, $item->price(true));

        $this->assertCount(1, $this->cart->items());
        $this->assertSame($this->cart->quantity(), 2);
        $this->assertSame($this->cart->total(), 267.00);
    }

    /** @test */
    public function it_can_add_multiple_items()
    {
        $item1 = $this->createItem('Foobar 1', 4, 3);
        $item2 = $this->createItem('Foobar 2', 21, 2.00);
        $item3 = $this->createItem('Foobar 3', 120, 2.00);

        $this->cart->add([$item1, $item2, $item3]);

        $this->assertCount(3, $this->cart->items());
        $this->assertSame($this->cart->quantity(), 7.00);
        $this->assertSame($this->cart->total(), 294.00);
    }

    /** @test */
    public function it_can_add_existing_item_to_update_its_quantity()
    {
        $item = $this->createItem('Foobar 1', 4, 3);

        $item = $this->cart->add($item);

        $this->assertSame($item->get('quantity'), 3);

        $item = $this->createItem('Foobar 1', 4, 6);

        $item = $this->cart->add($item);

        $this->assertSame($item->get('quantity'), 9);
    }

    /** @test */
    public function it_can_add_multiple_items_with_attributes()
    {
        $item1 = $this->createItem('Foobar 1', 4, 03, null, [5, 3.50]);
        $item2 = [
            'id'         => 'foobar3',
            'name'       => 'Foobar 3',
            'quantity'   => 4,
            'price'      => 120.00,
            'attributes' => [
                'color' => [
                    'label' => 'Blue',
                    'value' => 'blue',
                    'price' => 3.50,
                ],
            ],
        ];

        $items = $this->cart->add([$item1, $item2]);

        $item1 = $items[0];
        $item2 = $items[1];

        $this->assertCount(2, $item1->attributes());
        $this->assertCount(1, $item2->attributes());

        $this->assertCount(2, $this->cart->items());
        $this->assertSame($this->cart->quantity(), 7);
        $this->assertSame($this->cart->total(), 531.50);
    }

    /** @test */
    public function it_can_sync_data_from_a_collection()
    {
        $item1 = $this->createItem('Foobar 1', 50, 1);
        $item2 = $this->createItem('Foobar 2', 50, 1);

        $this->assertEmpty($this->cart->items());

        $data = new Collection([$item1, $item2]);

        $this->cart->sync($data);

        $this->assertCount(2, $this->cart->items());
    }
}
