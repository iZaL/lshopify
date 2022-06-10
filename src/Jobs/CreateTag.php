<?php

namespace IZal\Lshopify\Jobs;

use Illuminate\Database\Eloquent\Relations\Relation;
use IZal\Lshopify\Events\TagCreated;
use IZal\Lshopify\Models\Tag;

class CreateTag
{
    private array $attributes;

    public function __construct(array $attributes)
    {
        $this->attributes = $attributes;
    }

    public function handle(): Tag
    {
        $attributes = $this->attributes;
        $tag = new Tag();
        $tag->fill($attributes);
        $tag->save();

        if (isset($attributes['taggable_id']) && isset($attributes['taggable_type'])) {
            $taggableType = $attributes['taggable_type'];
            $taggableID = $attributes['taggable_id'];

            $morphedModel = Relation::getMorphedModel($taggableType);
            if ($morphedModel) {
                $relatedModel = $morphedModel::find($taggableID);
                $relatedModel?->tags()->attach($tag->id);
            }
        }

        event(new TagCreated($tag));

        return $tag;
    }
}
