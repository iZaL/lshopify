<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Products;

use IZal\Lshopify\Tests\TestCase;

class ProductIndexControllerTest extends TestCase
{
    public function test__invoke()
    {
        $response = $this->get(route('lshopify.products.index'));
        $response->assertInertia(
            fn ($assert) => $assert
            ->has('products')
        );
    }
}
