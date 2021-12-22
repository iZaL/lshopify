<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Products;

use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Tests\TestCase;

class ProductDeleteControllerTest extends TestCase
{
    public function test_can_delete_product()
    {
        $product = Product::factory()->create();
        $response = $this->delete(route('lshopify.products.destroy', $product->id));

        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }
}
