<?php

namespace IZaL\Lshopify\Database\Factories;

use IZal\Lshopify\Models\Collection;
use IZal\Lshopify\Models\CollectionCondition;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CollectionConditionFactory extends Factory
{
    protected $model = CollectionCondition::class;

    public function definition()
    {
        return [
            'collection_id' => Collection::factory()->create()->id,
            'criteria' => Str::random(6),
            'field' => Str::random(6),
            'value' => Str::random(6),
        ];
    }
}
