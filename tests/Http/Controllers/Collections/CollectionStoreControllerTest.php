<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Collections;

use IZal\Lshopify\Models\CollectionCondition;
use IZal\Lshopify\Tests\TestCase;

class CollectionStoreControllerTest extends TestCase
{
    public function test_can_store_manual_collection()
    {
        $data = [
            'name' => 'Summer collection',
            'description' => 'Summer collection',
            'type'=> 'manual',
            'conditions'=> [
                [
                    'field'=> '',
                    'criteria'=>'',
                    'value'=> 'xxxxx',
                ],
            ],
        ];
        $this->post(route('lshopify.collections.store'), $data);
        $this->assertDatabaseHas('collections', ['name' => 'Summer collection', 'type' => 'manual', 'determiner' => 'all']);
    }

    /**
     * @throws \Exception
     */
    public function test_throws_validation_error_when_invalid_data_passed()
    {
        $this->withExceptionHandling();
        $data = [
            'name' => 'Summer collection',
            'description' => 'Summer collection',
            'type'=> 'smart',
        ];
        $response = $this->post(route('lshopify.collections.store'), $data);
        $response->assertSessionHas('errors');
    }

    public function test_can_store_smart_collection()
    {
        $data = [
            'name' => 'Summer collection',
            'description' => 'Summer collection',
            'type'=> 'smart',
            'determiner'=> 'all',
            'conditions'=> [
                [
                    'field'=> 'product_title',
                    'criteria'=>'is_not_equal_to',
                    'value'=> 'xxxxx',
                ],
                [
                    'field'=> 'product_vendor',
                    'criteria'=>'is_equal_to',
                    'value'=> 'sssss',
                ],
            ],
        ];

        $this->post(route('lshopify.collections.store'), $data);

        $this->assertDatabaseHas('collections', ['name' => 'Summer collection', 'type' => 'smart', 'determiner' => 'all']);

        $collection = CollectionCondition::all()->last();
        $this->assertDatabaseHas('collection_conditions', ['collection_id' => $collection->collection_id, 'criteria' => 'is_not_equal_to', 'field' => 'product_title', 'value' => 'xxxxx']);
        $this->assertDatabaseHas('collection_conditions', ['collection_id' => $collection->collection_id, 'criteria' => 'is_equal_to', 'field' => 'product_vendor', 'value' => 'sssss']);
    }
}
