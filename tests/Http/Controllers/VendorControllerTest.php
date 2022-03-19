<?php

namespace IZal\Lshopify\Tests\Http\Controllers;

use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Tests\TestCase;

class VendorControllerTest extends TestCase
{
    public function test_can_store_vendor()
    {
        $product = Product::factory()->create();
        $response = $this->post(route('lshopify.vendors.store'), [
            'name' => 'Test Vendor',
            'product_id' => $product->id,
        ]);

        $this->assertDatabaseHas('vendors', [
            'name' => 'Test Vendor',
        ]);

        $this->assertDatabaseHas('products',[
            'id' => $product->id,
            'vendor_id' => 1,
        ]);

        $response->assertStatus(302);
    }
}
