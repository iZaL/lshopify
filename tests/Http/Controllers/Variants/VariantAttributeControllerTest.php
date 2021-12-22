<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Variants;

use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Tests\TestCase;

class VariantAttributeControllerTest extends TestCase
{
    public function test_can_update_variant_attributes()
    {
        $product = Product::factory()->has(Variant::factory()->count(3))->create();

        $variants = $product->variants()->get();
        $variantIDs = $variants->pluck('id')->toArray();

        $req = $this->post(route('lshopify.products.variants.attributes', $product->id), [
            'variants' => $variantIDs,
            'field' => 'price',
            'value' => 10,
        ]);

        $this->assertDatabaseHas('variants', ['id' => $variantIDs[0], 'price' => 10]);
        $this->assertDatabaseHas('variants', ['id' => $variantIDs[1], 'price' => 10]);
        $this->assertDatabaseHas('variants', ['id' => $variantIDs[2], 'price' => 10]);
    }
}
