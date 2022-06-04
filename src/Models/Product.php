<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use IZal\Lshopify\Database\Factories\ProductFactory;
use IZal\Lshopify\Models\Traits\ImageableTrait;
use IZal\Lshopify\Models\Traits\TaggableTrait;

class Product extends BaseModel
{
    use HasFactory;
    use TaggableTrait;
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

    public static function newFactory(): ProductFactory
    {
        return ProductFactory::new();
    }

    public function all_variants(): HasMany
    {
        return $this->hasMany(Variant::class, 'product_id');
    }

    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(Collection::class, 'collection_products');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function vendor(): BelongsTo
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

    public function getVariantOptionsNewAttribute(): array
    {
        return $this->variants
            ->pluck('options')
            ->collapse()
            ->groupBy('id')
            ->map(function ($option) {
                return [
                    'id' => $option[0]['id'] ?? null,
                    'name' => $option[0]['id'] ?? null,
                    'values' => $option
                        ->pluck('name')
                        ->unique()
                        ->values()
                        ->map(function ($value) {
                            return [
                                'id' => $value,
                                'name' => $value,
                            ];
                        })
                        ->toArray(),
                ];
            })
            ->values()
            ->toArray();
    }

    public function getIsInventoryTrackedAttribute(): bool
    {
        $hasVariants = $this->variants()->count() > 0;
        if ($hasVariants) {
            return $this->variants()
                ->where('tracked', 1)
                ->count() > 0;
        }
        return $this->default_variant()
            ->where('tracked', 1)
            ->count() > 0;
    }

    public function variants(): HasMany
    {
        return $this->hasMany(Variant::class, 'product_id')
            ->whereNotNull('options')
            ->where('default', 0);
    }

    public function default_variant(): HasOne
    {
        return $this->hasOne(Variant::class, 'product_id')->where('default', 1);
    }

    public function getAvailableQuantityAttribute()
    {
        $hasVariants = $this->variants()->count() > 0;
        if ($hasVariants) {
            return $this->variants()->sum('quantity');
        }
        return $this->default_variant()->sum('quantity');
    }

    public function scopeForCollection($query, $value)
    {
        $collection = Collection::where('name', $value)->first();
        return $collection->isManual() ? $collection->products : $collection->smart_products();
    }

    public function price()
    {
        $defaultPrice = $this->default_variant->price;
        if ($this->variants()->count()) {
            $defaultPrice = $this->variants()->first()->price;
        }
        return $defaultPrice;
    }

    public function getDisplayImageAttribute()
    {
        return $this->default_image ? url($this->default_image->url) : url($this->image?->url);
    }

    public function hasColor()
    {
        // check if variants has color
    }
}
