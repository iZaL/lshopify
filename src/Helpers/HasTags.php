<?php

namespace IZal\Lshopify\Helpers;

use IZal\Lshopify\Models\Tag;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

trait HasTags
{
    public function syncTags(array $tags)
    {
        $this->save();
        $this->tags()->sync($tags);
    }

    public function removeTags()
    {
        $this->tags()->detach();
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable')->withTimestamps();
    }
}
