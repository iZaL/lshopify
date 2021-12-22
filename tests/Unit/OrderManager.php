<?php

namespace IZal\Lshopify\Tests\Unit;

use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\OrderVariant;
use PHPUnit\Framework\TestCase;

class OrderManager extends TestCase
{
    /**
     * A basic test example.
     *
     * @return void
     */
    public function test_return_item()
    {

        // quantity 10

        $order = Order::factory()
            ->hasAttached(
                OrderVariant::factory()->create(),
                [
                    'quantity' => 10,
                    'price' => 100,
                    'unit_price' => 100,
                    'total' => 100,
                    'subtotal' => 100,
                ],
                'variants',
            )
            ->create();
    }
}
