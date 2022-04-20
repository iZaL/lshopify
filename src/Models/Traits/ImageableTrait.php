<?php

namespace IZal\Lshopify\Models\Traits;

use IZal\Lshopify\Models\Image;

trait ImageableTrait
{
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    public function image()
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}
