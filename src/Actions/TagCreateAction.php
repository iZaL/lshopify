<?php

namespace IZal\Lshopify\Actions;

use IZal\Lshopify\Models\Tag;

class TagCreateAction
{
    /**
     * @var Tag
     */
    private Tag $tag;

    public function __construct(Tag $tag)
    {
        $this->tag = $tag;
    }

    public function create(array $attributes): Tag
    {
        $attributes = collect($attributes);
        $tag = $this->tag->create($attributes->only($this->tag->getFillable())->toArray());

        if (in_array('taggable_id', $attributes->keys()->toArray())) {
            $taggableType = $attributes->pull('taggable_type');
            if (isset($tag->morphs[$taggableType])) {
                $taggableType = $tag->morphs[$taggableType];
                $taggableID = $attributes->pull('taggable_id');
                $model = $taggableType::find($taggableID);
                $model?->tags()->attach($tag->id);
            }
        }

        return $tag;
    }

}
