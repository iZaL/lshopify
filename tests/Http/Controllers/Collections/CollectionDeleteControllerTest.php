<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Collections;

use IZal\Lshopify\Models\Collection;
use IZal\Lshopify\Tests\TestCase;

class CollectionDeleteControllerTest extends TestCase
{
    public function test_delete_collection()
    {
        $collection = Collection::factory()->create();
        $response = $this->delete(route('lshopify.collections.destroy', $collection->id));

        $this->assertDatabaseMissing('collections', ['id' => $collection->id]);
    }
}
