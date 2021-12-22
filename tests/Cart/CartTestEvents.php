<?php

namespace IZal\Lshopify\Tests\Cart;

use IZal\Lshopify\Cart\Cart;
use IZal\Lshopify\Cart\Storage\IlluminateSession;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Session\FileSessionHandler;
use Illuminate\Session\Store;
use Mockery as m;

class CartTestEvents extends CartTestCase
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

    /**
     * Setup resources and dependencies.
     */
    protected function setUp(): void
    {
        $sessionHandler = new FileSessionHandler(new Filesystem(), __DIR__.'/storage/sessions', 120);

        $session = new IlluminateSession(new Store('cart_session', $sessionHandler));

        $this->dispatcher = m::mock('Illuminate\Contracts\Events\Dispatcher');

        $this->dispatcherMethod = method_exists($this->dispatcher, 'fire') ? 'fire' : 'dispatch';

        $this->cart = new Cart($session, $this->dispatcher);
    }

    /** @test */
    public function can_listen_to_the_added_event()
    {
        $this->dispatcher->shouldReceive($this->dispatcherMethod)->once()->with('cart.created', m::any());

        $this->dispatcher->shouldReceive($this->dispatcherMethod)->once()->with('cart.added', m::any());

        $this->cart->add(
            $this->createItem('Foobar 1', 125, 2)
        );
    }

    /** @test */
    public function can_listen_to_the_updated_event()
    {
        $this->dispatcher->shouldReceive($this->dispatcherMethod)->once()->with('cart.created', m::any());

        $this->dispatcher->shouldReceive($this->dispatcherMethod)->once()->with('cart.added', m::any());

        $this->dispatcher->shouldReceive($this->dispatcherMethod)->once()->with('cart.updated', m::any());

        $item = $this->cart->add(
            $this->createItem('Foobar 1', 125, 2)
        );

        $this->cart->update($item['rowId'], [
            'name' => 'Foo',
        ]);
    }

    /** @test */
    public function can_listen_to_the_removed_event()
    {
        $this->dispatcher->shouldReceive($this->dispatcherMethod)->once()->with('cart.created', m::any());

        $this->dispatcher->shouldReceive($this->dispatcherMethod)->once()->with('cart.added', m::any());

        $this->dispatcher->shouldReceive($this->dispatcherMethod)->once()->with('cart.removed', m::any());

        $item = $this->cart->add(
            $this->createItem('Foobar 1', 125, 2)
        );

        $this->cart->remove($item['rowId']);
    }

    /** @test */
    public function can_listen_to_the_cleared_event()
    {
        $this->dispatcher->shouldReceive($this->dispatcherMethod)->once()->with('cart.cleared', m::any());

        $this->cart->clear();
    }
}
