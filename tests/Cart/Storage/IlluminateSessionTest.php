<?php

namespace IZal\Lshopify\Tests\Cart\Storage;

use IZal\Lshopify\Cart\Storage\IlluminateSession;
use Mockery as m;
use IZal\Lshopify\Tests\Cart\CartTestCase;

class IlluminateSessionTest extends CartTestCase
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
    public function it_can_get_cart_session_key_and_cart_identity()
    {
        $this->assertSame($this->cart->getStorage()->getInstance(), 'main');
        $this->assertSame($this->cart->getStorage()->getKey(), 'lshopify_cart');
        $this->assertInstanceOf('IZal\Lshopify\Cart\Storage\IlluminateSession', $this->cart->getStorage());

        $this->cart->add($this->createItem('Foobar 1', 125, 2));

        $this->assertCount(1, $this->cart->items());

        $this->cart->getStorage()->forget();

        $this->assertNull($this->cart->getStorage()->get());
    }

    /** @test */
    public function it_can_set_cart_session_key_and_cart_identity_on_initialization()
    {
        $session = new IlluminateSession(m::mock('Illuminate\Session\Store'), 'instance', 'cart');

        $this->assertSame($session->getKey(), 'cart');
        $this->assertSame($session->getInstance(), 'instance');
    }
}
