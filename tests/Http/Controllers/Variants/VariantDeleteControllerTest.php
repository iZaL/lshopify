<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Variants;

use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Tests\TestCase;

class VariantDeleteControllerTest extends TestCase
{
    public function test_can_delete_variants()
    {
        $product = Product::factory()
            ->hasVariants(3, function (array $attributes, Product $product) {
                return ['product_id' => $product->id];
            })
            ->create();

        $variants = $product->variants()->get();

        $deletingVariant = $variants[1];

        $response = $this->post(route('lshopify.products.variants.destroy', $product->id), ['variants' => [$deletingVariant->id]]);

        $this->assertDatabaseMissing('variants', ['id' => $deletingVariant->id]);
    }
}
