<?php

namespace IZal\Lshopify\Actions;

use IZal\Lshopify\Models\Tag;

class TagCreateAction
{
    /**
     * @var Tag
     */
    private $tag;

    public function __construct(Tag $tag)
    {
        $this->tag = $tag;
    }

    public function create(array $attributes): Tag
    {
        $attributes = collect($attributes);
        $tag = $this->tag->create($attributes->only($this->getFillable())->toArray());

        //        if($attributes->count()) {
        //            dd($attributes->toArray());
        //        }

        if (in_array('taggable_id', $attributes->keys()->toArray())) {
            $taggableType = $attributes->pull('taggable_type');
            if (isset($tag->morphs[$taggableType])) {
                $taggableType = $tag->morphs[$taggableType];
                $taggableID = $attributes->pull('taggable_id');

                $model = $taggableType::find($taggableID);
                if ($model) {
                    $model->tags()->attach($tag->id);
                }
            }
        }

        return $tag;
    }

    public function getFillable()
    {
        return $this->tag->getFillable();
    }
}
