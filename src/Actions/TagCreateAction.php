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

    public function create(array $attributes): self
    {
        $category = $this->tag->create(
            collect($attributes)
                ->only($this->getFillable())
                ->toArray()
        );

        return $this;
    }

    public function getFillable()
    {
        return $this->tag->getFillable();
    }
}
