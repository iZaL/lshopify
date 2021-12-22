<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Collections;

use IZal\Lshopify\Tests\TestCase;

class CollectionCreateControllerTest extends TestCase
{
    public function test_create_controller_page()
    {
        $response = $this->get(route('lshopify.collections.create'));
        $response->assertInertia(
            fn ($assert) => $assert
            ->has('collections')
        );
    }
}
