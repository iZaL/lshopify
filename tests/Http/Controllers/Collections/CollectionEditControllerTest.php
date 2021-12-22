<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Collections;

use IZal\Lshopify\Models\Collection;
use IZal\Lshopify\Tests\TestCase;

class CollectionEditControllerTest extends TestCase
{
    public function test_create_controller_page()
    {
        $collection = Collection::factory()->create();
        $response = $this->get(route('lshopify.collections.edit', $collection->id));
        $response->assertInertia(
            fn ($assert) => $assert
            ->has('collection')
            ->has('products')
        );
    }
}
