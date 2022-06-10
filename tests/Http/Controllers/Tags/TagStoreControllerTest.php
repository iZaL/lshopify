<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Tags;

use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Tests\TestCase;

class TagStoreControllerTest extends TestCase
{
    public function test_can_create_tags()
    {
        $tag = 'ABC';
        $product = Product::factory()->create();
        $this->post(route('lshopify.tags.store'), ['name' => $tag,'taggable_id'=>$product->id,'taggable_type' => 'product']);
        $this->assertDatabaseHas('tags', ['name' => $tag]);
        $this->assertDatabaseHas('taggables',['taggable_id' => $product->id, 'taggable_type' => 'product']);
    }
}
