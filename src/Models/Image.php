<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use IZal\Lshopify\Database\Factories\ImageFactory;

class Image extends BaseModel
{
    use HasFactory;

    protected $table = 'images';

    protected $fillable = ['name', 'imageable_id', 'imageable_type'];

    public static function newFactory()
    {
        return ImageFactory::new();
    }

    public function imageable()
    {
        return $this->morphTo();
    }

    public function getUrlAttribute()
    {
        $link = \Storage::disk(config('lshopify.storage.disk', 'public'))->url($this->attributes['name']);
        return $link;
    }
}
