<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Tags;

use IZal\Lshopify\Tests\TestCase;

class TagStoreControllerTest extends TestCase
{
    public function test_can_create_tags()
    {
        $tag = 'ABC';
        $this->post('tags', ['name' => $tag]);
        $this->assertDatabaseHas('tags', ['name' => $tag]);
    }
}
