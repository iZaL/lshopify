<?php

namespace IZal\Lshopify\Models;

use IZal\Lshopify\Database\Factories\ProductFactory;
use IZal\Lshopify\Helpers\HasTags;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends BaseModel
{
    use HasFactory;
    use HasTags;
    use ImageableTrait;

    protected $table = 'products';

    protected $fillable = [
        'title',
        'description',
        'status',
        'category_id',
        'vendor_id',
        'seo_title',
        'seo_description',
        'seo_url',
    ];

    protected $with = ['image'];

    public static function newFactory()
    {
        return ProductFactory::new();
    }

    public function all_variants()
    {
        return $this->hasMany(Variant::class,'product_id');
    }

    public function variants()
    {
        return $this->hasMany(Variant::class, 'product_id')
            ->whereNotNull('options')
            ->where('default', 0);
    }

    public function collections()
    {
        return $this->belongsToMany(Collection::class, 'collection_products');
    }

    public function default_variant()
    {
        return $this->hasOne(Variant::class, 'product_id')->where('default', 1);
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }

    public function getDefaultImageAttribute()
    {
        return $this->image;
    }

    public function getVariantOptionsAttribute(): array
    {
        return $this->variants
            ->pluck('options')
            ->unique('id')
            ->collapse()
            ->toArray();
    }

    public function getVariantOptionsValuesAttribute(): array
    {
        $variants = $this->variants
            ->pluck('options')
            ->collapse()
            ->unique()
            ->toArray();

        return [...$variants];
    }

    public function getIsInventoryTrackedAttribute(): bool
    {
        $hasVariants = $this->variants()->count() > 0;
        if($hasVariants) {
            return $this->variants()->where('track_quantity',1)->count() > 0;
        }
        return $this->default_variant()->where('track_quantity',1)->count() > 0;
    }

    public function getAvailableQuantityAttribute()
    {
        $hasVariants = $this->variants()->count() > 0;
        if($hasVariants) {
            return $this->variants()->sum('quantity');
        }
        return $this->default_variant()->sum('quantity');
    }

}
