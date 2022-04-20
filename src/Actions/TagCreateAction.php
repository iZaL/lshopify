<?php

namespace IZal\Lshopify\Actions;

use Illuminate\Database\Eloquent\Relations\Relation;
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

    public function create(array $attributes): Tag | null
    {
        $attributes = collect($attributes);
        $tag = $this->tag->create($attributes->only($this->tag->getFillable())->toArray());
        $taggableType = $attributes->pull('taggable_type');
        $taggableID = $attributes->pull('taggable_id');
        $morphedModel = Relation::getMorphedModel($taggableType);
        if($morphedModel) {
            $relatedModel = $morphedModel::find($taggableID);
            $relatedModel?->tags()->attach($tag->id);
            return $tag;
        }
        return null;
    }
}
