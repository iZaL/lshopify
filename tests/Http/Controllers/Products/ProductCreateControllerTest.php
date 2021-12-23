<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Products;

use IZal\Lshopify\Tests\TestCase;

class ProductCreateControllerTest extends TestCase
{
    public function test__invoke()
    {
        $response = $this->get(route('lshopify.products.create'));
        $response->assertInertia(
            fn ($assert) => $assert
            ->has('collection')
            ->has('variants')
            ->has('tags')
            ->has('product_types')
        );
    }
}
