<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Products;

use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Tests\TestCase;

class ProductEditControllerTest extends TestCase
{
    public function test__invoke()
    {
        $product = Product::factory()
            ->hasVariants(3, function (array $attributes, Product $product) {
                return ['product_id' => $product->id];
            })
            ->create();

        $response = $this->get(route('lshopify.products.edit',$product->id));
        $response->assertInertia(
            fn ($assert) => $assert
            ->has('product')
            ->has('collection')
            ->has('variants')
            ->has('tags')
            ->has('product_types')
            ->has('variant_options')
            ->has('variant_values')
        );
    }
}
