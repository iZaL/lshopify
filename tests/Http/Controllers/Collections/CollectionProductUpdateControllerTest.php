<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Collections;

use IZal\Lshopify\Models\Collection;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Tests\TestCase;

class CollectionProductUpdateControllerTest extends TestCase
{
    public function test_update_collection_products()
    {
        $collection = Collection::factory()->has(Product::factory()->count(2))->create();

        $newProduct = Product::factory()->create();

        $products = $collection->products()->get()->pluck('id')->toArray();

        $product1 = $products[0];
        $product2 = $products[1];

        $req = $this->post(route('lshopify.collections.products.update', $collection->id), ['products'=>[$product2, $newProduct->id]]);

        $this->assertDatabaseHas('collection_products', ['product_id' => $product2]);
        $this->assertDatabaseHas('collection_products', ['product_id' => $newProduct->id]);

        $this->assertDatabaseMissing('collection_products', ['product_id' => $product1]);
    }
}
