<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Collections;

use IZal\Lshopify\Models\Collection;
use IZal\Lshopify\Tests\TestCase;

class CollectionIndexControllerTest extends TestCase
{
    public function test_collection_index_page()
    {
        $collection = Collection::factory()->create();
        $response = $this->get(route('lshopify.collections.index'));
        $response->assertInertia(
            fn ($assert) => $assert
            ->has('collections')
        );
    }
}
