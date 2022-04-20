<?php

namespace IZal\Lshopify\Models\Traits;

use IZal\Lshopify\Models\Tag;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

trait TaggableTrait
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
