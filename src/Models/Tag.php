<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Tag extends BaseModel
{
    use HasFactory;

    protected $table = 'tags';
    public $timestamps = false;

    protected $fillable = ['name', 'slug'];

    public function taggable()
    {
        return $this->morphTo();
    }

    public function products(): MorphToMany
    {
        return $this->morphedByMany(Product::class, 'taggable');
    }
}
