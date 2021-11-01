<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Collection extends BaseModel
{
    use HasFactory;

    protected $table = 'collections';
    public $timestamps = false;

    protected $fillable = ['name', 'slug', 'type', 'determiner'];

    public function conditions()
    {
        return $this->hasMany(CollectionCondition::class, 'collection_id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'collection_products', 'collection_id', 'product_id');
    }

    public function smart_products()
    {
        return Product::all();
    }

    public function manual(): bool
    {
        return $this->type === 'manual';
    }
}
