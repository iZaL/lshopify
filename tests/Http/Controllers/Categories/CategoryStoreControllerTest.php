<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Categories;

use IZal\Lshopify\Tests\TestCase;

class CategoryStoreControllerTest extends TestCase
{
    public function test_create_categories()
    {
        $categoryData = ['name' => 'Shirt'];
        $data = $categoryData;
        $response = $this->post(route('lshopify.categories.store'), $data);
        $this->assertDatabaseHas('categories', $categoryData);
    }
}
