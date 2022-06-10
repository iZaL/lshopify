<?php

namespace IZal\Lshopify\Events;

use IZal\Lshopify\Models\Tag;

class TagCreated
{
    public function __construct(Tag $tag)
    {
    }
}
