<?php

namespace IZal\Lshopify\Tests\Cart;

require 'CartTestCase.php';

use IZal\Lshopify\Cart\Cart;
use Mockery as m;

class CartTest extends CartTestCase
{
    /**
     * Close mockery.
     *
     * @return void
     */
    protected function tearDown(): void
    {
        m::close();
    }

    /** @test */
    public function cart_can_be_instantiated()
    {
        $cart = new Cart(
            m::mock('IZal\Lshopify\Cart\Storage\IlluminateSession'),
            m::mock('Illuminate\Contracts\Events\Dispatcher')
        );

        $this->assertInstanceOf('IZal\Lshopify\Cart\Cart', $cart);
    }

    /** @test */
    public function it_can_set_the_required_indexes()
    {
        $this->cart->setRequiredIndexes([
            'price',
        ]);

        $this->assertTrue(in_array('price', $this->cart->getRequiredIndexes()));
    }

    /** @test */
    public function it_can_get_the_cart_identity()
    {
        $this->assertSame($this->cart->getInstance(), 'main');
    }

    /** @test */
    public function it_can_set_the_cart_identity()
    {
        $this->cart->setInstance('testCart');

        $this->assertSame($this->cart->getInstance(), 'testCart');
    }

    /** @test */
    public function it_can_get_the_cart_storage()
    {
        $this->assertInstanceOf('IZal\Lshopify\Cart\Storage\StorageInterface', $this->cart->getStorage());
    }

    /** @test */
    public function it_can_set_the_cart_storage()
    {
        $this->cart->setStorage(
            m::mock('IZal\Lshopify\Cart\Storage\StorageInterface')
        );

        $this->assertInstanceOf('IZal\Lshopify\Cart\Storage\StorageInterface', $this->cart->getStorage());
    }

    /** @test */
    public function it_can_get_the_cart_dispatcher()
    {
        $this->assertInstanceOf('Illuminate\Contracts\Events\Dispatcher', $this->cart->getDispatcher());
    }

    /** @test */
    public function it_can_set_the_cart_dispatcher()
    {
        $this->cart->setDispatcher(m::mock('Illuminate\Contracts\Events\Dispatcher'));

        $this->assertInstanceOf('Illuminate\Contracts\Events\Dispatcher', $this->cart->getDispatcher());
    }

    /** @test */
    public function it_can_get_the_total_number_of_items_inside_the_cart()
    {
        $this->cart->add([
            $this->createItem('Foobar 1', 97, 4.5),
            $this->createItem('Foobar 2', 85, 2),
        ]);

        $this->assertSame($this->cart->quantity(), 6.5);
    }

    /** @test */
    public function it_can_get_the_total_cart_weight()
    {
        $item1 = $this->createItem('Foobar 1', 97, 4, null, null, 21.49);
        $item2 = $this->createItem('Foobar 2', 85, 2, null, null, 21.32);
        $item3 = [
            'id'         => 'foobar2',
            'name'       => 'Foobar 2',
            'quantity'   => 2,
            'price'      => 200.00,
            'weight'     => 20.00,
            'attributes' => [
                'size' => [
                    'label'  => 'Large',
                    'value'  => 'l',
                    'weight' => 1.5,
                ],
                'shape' => [
                    'label'  => 'Circle',
                    'value'  => 'c',
                    'weight' => 10.00,
                ],
            ],
        ];

        $this->cart->add([$item1, $item2, $item3]);

        $this->assertSame($this->cart->weight(), 191.6);
    }

    /** @test */
    public function cart_can_be_cleared()
    {
        $this->cart->add(
            $this->createItem('Foobar 1', 97, 4, null, null, 21.49)
        );

        $this->assertSame($this->cart->quantity(), 4);

        $this->cart->clear();

        $this->assertSame($this->cart->quantity(), 0);
        $this->assertTrue($this->cart->items()->isEmpty());
    }

    /** @test */
    public function cart_can_be_searched()
    {
        $this->cart->add([
            $this->createItem('Foobar 1', 97, 2, null, [0, 17.00], 21.00),
            $this->createItem('Foobar 2', 85, 2, null, [15, 0], 21.00),
            $this->createItem('Foobar 3', 35, 5, null, [5, 17.00], 21.00),
        ]);

        $items = $this->cart->find([
            'price'    => 85,
            'quantity' => 2,
        ]);

        $this->assertSame($items[0]->get('id'), 'foobar2');

        $this->assertCount(1, $items);
    }

    /** @test */
    public function cart_can_be_searched_by_items_attributes()
    {
        $this->cart->add([
            $this->createItem('Foobar 1', 97, 2, null, [0, 17.00], 21.00),
            $this->createItem('Foobar 2', 85, 2, null, [15, 0], 21.00),
            $this->createItem('Foobar 3', 35, 5, null, [5, 17.00], 21.00),
        ]);

        $item = $this->cart->find([
            'price'    => 85,
            'quantity' => 2,
            'weight'   => 21,
        ]);

        $this->assertSame($item[0]->get('id'), 'foobar2');
        $this->assertSame($item[0]->price(), 85.00);

        $items = $this->cart->find([
            'attributes' => [
                'color' => [
                    'price' => 17,
                ],
            ],
        ]);

        $this->assertCount(2, $items);
        $this->assertSame($items[0]->get('id'), 'foobar1');
        $this->assertSame($items[1]->get('id'), 'foobar3');
    }

    /** @test */
    public function cart_can_be_searched_and_returning_empty_results()
    {
        $this->cart->add([
            'id'       => 'foobar2',
            'name'     => 'Foobar 2',
            'quantity' => 2,
            'price'    => 200.00,
        ]);

        $item = $this->cart->find([
            'price'      => 85,
            'attributes' => [
                'color' => [
                    'label' => 'Red',
                ],
            ],
        ]);

        $this->assertEmpty($item);
    }

    /** @test */
    public function see_if_item_exists()
    {
        $item = $this->cart->add(
            $this->createItem('Foobar 1', 200, 2)
        );

        $this->assertTrue($this->cart->exists($item['rowId']));
    }

    /** @test */
    public function see_if_item_does_not_exist()
    {
        $this->assertFalse($this->cart->exists('foobar'));
    }

    /** @test */
    public function it_can_set_meta_data_with_dot_notation()
    {
        $this->cart->setMetaData('foo', 'bar');

        $this->assertSame($this->cart->getMetaData('foo'), 'bar');

        $this->cart->setMetaData('foo', ['bar' => 'baz']);

        $this->assertSame(count($this->cart->getMetaData('foo')), 1);
        $this->assertSame($this->cart->getMetaData('foo.bar'), 'baz');

        $this->cart->setMetaData('foo.bat', 'qux');

        $this->assertSame(count($this->cart->getMetaData('foo')), 2);
        $this->assertSame($this->cart->getMetaData('foo.bar'), 'baz');
        $this->assertSame($this->cart->getMetaData('foo.bat'), 'qux');
    }

    /** @test */
    public function it_can_retrieve_meta_data()
    {
        $this->cart->setMetaData('shipping_info', [
            'personal_details' => [
                'name' => 'John Doe',
            ],
            'billing_address' => [
                'house'  => 123,
                'street' => '123 Street.',
            ],
        ]);

        $this->assertSame($this->cart->getMetaData('shipping_info.personal_details.name'), 'John Doe');
        $this->assertSame($this->cart->getMetaData('shipping_info.billing_address.street'), '123 Street.');
        $this->assertSame($this->cart->getMetaData('nonexistent', 'default'), 'default');
    }

    /** @test */
    public function it_can_remove_meta_data()
    {
        $this->cart->setMetaData('shipping_info', [
            'personal_details' => [
                'name' => 'John Doe',
            ],
            'billing_address' => [
                'house'  => 123,
                'street' => '123 Street.',
            ],
        ]);

        $this->assertSame($this->cart->getMetaData('shipping_info.personal_details.name'), 'John Doe');

        $this->cart->removeMetaData('shipping_info.personal_details');

        $this->assertEmpty($this->cart->getMetaData('shipping_info.personal_details'));
        $this->assertSame($this->cart->getMetaData('shipping_info.billing_address.house'), 123);

        $this->cart->removeMetaData();

        $this->assertEmpty($this->cart->getMetaData('shipping_info.personal_details'));
        $this->assertEmpty($this->cart->getMetaData('shipping_info.billing_address'));
    }

    /** @test */
    public function it_can_get_the_cart_instance_from_the_collection()
    {
        $this->assertInstanceOf('IZal\Lshopify\Cart\Cart', $this->cart->getCart());
    }

    /** @test */
    public function it_can_serialize_and_unserialize_the_cart()
    {
        $this->cart->add([
            $this->createItem('Foobar 1', 97, 2, null, [0, 17.00], 21.00),
            $this->createItem('Foobar 2', 85, 2, null, [15, 0], 21.00),
            $this->createItem('Foobar 3', 35, 5, null, [5, 17.00], 21.00),
        ]);

        $this->cart->condition([
            $this->createCondition('Discount 5%', 'discount', '-5.00%'),
        ]);

        $this->assertCount(3, $this->cart->items());
        $this->assertSame(9, $this->cart->quantity());
        $this->assertSame(677.35, $this->cart->total());
        $this->assertCount(1, $this->cart->conditions('discount'));

        $cart = $this->cart->serialize();

        $this->cart->clear();

        $this->assertSame(0, $this->cart->quantity());
        $this->assertCount(0, $this->cart->conditions('discount'));

        $this->cart->unserialize($cart);

        $this->assertCount(3, $this->cart->items());
        $this->assertSame(9, $this->cart->quantity());
        $this->assertSame(677.35, $this->cart->total());
        $this->assertCount(1, $this->cart->conditions('discount'));
    }

    /** @test */
    public function it_can_get_the_serializable_properties()
    {
        $expected = [
            'items',
            'metaData',
            'conditions',
            'conditionsOrder',
            'requiredIndexes',
            'itemsConditionsOrder',
        ];

        $properties = $this->cart->getSerializable();

        $this->assertSame($properties, $expected);
    }

    /** @test */
    public function it_can_set_the_serializable_properties()
    {
        $expected = [
            'items',
            'metaData',
            'conditions',
            'conditionsOrder',
            'itemsConditionsOrder',
        ];

        $this->cart->setSerializable($expected);

        $properties = $this->cart->getSerializable();

        $this->assertSame($properties, $expected);
    }

    /** @test */
    public function it_can_get_and_set_the_event_dispatcher_status()
    {
        $this->assertTrue($this->cart->getEventDispatcherStatus());

        $this->cart->setEventDispatcherStatus(false);

        $this->assertFalse($this->cart->getEventDispatcherStatus());
    }
}
