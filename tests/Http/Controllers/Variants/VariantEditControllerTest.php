<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Variants;

use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Tests\TestCase;

class VariantEditControllerTest extends TestCase
{
    public function test_can_edit_variant()
    {
        $product = Product::factory()
            ->hasVariants(3, function (array $attributes, Product $product) {
                return ['product_id' => $product->id];
            })
            ->create();

        $variants = $product->variants()->get();

        $editingVariant = $variants[1];

        $response = $this->get(route('lshopify.products.variants.edit', [$product->id, $editingVariant->id]));

        $response->assertInertia(
            fn ($assert) => $assert
            ->has('product')
            ->has('variant')
        );
    }
}
