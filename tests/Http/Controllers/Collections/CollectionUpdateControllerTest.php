<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Collections;

use IZal\Lshopify\Models\Collection;
use IZal\Lshopify\Models\CollectionCondition;
use IZal\Lshopify\Tests\TestCase;

class CollectionUpdateControllerTest extends TestCase
{
    public function test_updates_collection()
    {
        $collection = Collection::factory()
            ->hasConditions(1, function (array $attributes, Collection $collection) {
                return ['collection_id' => $collection->id];
            })
            ->create();

        $data = [
            'name' => 'Summer collection',
            'description' => 'Summer collection',
            'type'=> 'smart',
            'determiner'=> 'all',
            'conditions'=> [
                [
                    'id'  => $collection->conditions()->first()->id,
                    'field'=> 'product_title',
                    'criteria'=>'is_not_equal_to',
                    'value'=> 'xxxxx',
                ],
            ],
        ];

        $request = $this->patch(route('lshopify.collections.update', $collection->id), $data);

        $this->assertDatabaseHas('collections', ['name' => 'Summer collection', 'type' => 'smart', 'determiner' => 'all']);

        $collection = CollectionCondition::all()->last();
        $this->assertDatabaseHas('collection_conditions', ['collection_id' => $collection->collection_id, 'criteria' => 'is_not_equal_to', 'field' => 'product_title', 'value' => 'xxxxx']);
    }
}
