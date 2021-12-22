<?php

namespace IZal\Lshopify\Tests\Cart\Laravel\Facades;

use PHPUnit\Framework\TestCase;
use ReflectionClass;

class CartTest extends TestCase
{
    /** @test */
    public function it_can_test_it_is_a_facade()
    {
        $facade = new ReflectionClass('Illuminate\Support\Facades\Facade');

        $reflection = new ReflectionClass('IZal\Lshopify\Cart\Facades\Cart');

        $this->assertTrue($reflection->isSubclassOf($facade));
    }

    /** @test */
    public function it_can_test_it_is_a_facade_accessor()
    {
        $reflection = new ReflectionClass('IZal\Lshopify\Cart\Facades\Cart');

        $method = $reflection->getMethod('getFacadeAccessor');
        $method->setAccessible(true);

        $this->assertSame('cart', $method->invoke(null));
    }
}
