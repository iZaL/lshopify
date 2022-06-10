<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Categories;

use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Tests\TestCase;

class CategoryStoreControllerTest extends TestCase
{
    public function test_create_categories()
    {
        $product = Product::factory()->create();
        $categoryData = ['name' => 'Shirt','product_id' => $product->id];
        $data = $categoryData;
        $this->post(route('lshopify.categories.store'), $data);
        $this->assertDatabaseHas('categories', ['name' => 'Shirt']);
        $this->assertDatabaseHas('products', ['category_id' => 1]);
    }
}
