<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Variants;

use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Tests\TestCase;

class VariantCreateControllerTest extends TestCase
{
    public function test__invoke()
    {
        $product = Product::factory()
            ->hasVariants(3, function (array $attributes, Product $product) {
                return ['product_id' => $product->id];
            })
            ->create();
        $response = $this->get(route('lshopify.products.variants.create',$product->id));
        $response->assertInertia(
            fn ($assert) => $assert
            ->has('product')
            ->has('variant_options')
        );
    }
}
