<?php

namespace IZal\Lshopify\Models;

use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use IZal\Lshopify\Database\Factories\CollectionFactory;
use IZal\Lshopify\Models\Traits\ImageableTrait;
use IZal\Lshopify\Models\Traits\TaggableTrait;
use IZal\Lshopify\Managers\CollectionCriteriaManager;
use IZal\Lshopify\Managers\ConditionFieldManager;

class Collection extends BaseModel
{
    use HasFactory;
    use TaggableTrait;
    use ImageableTrait;

    public $timestamps = false;

    protected $table = 'collections';

    protected $fillable = ['name', 'slug', 'type', 'determiner', 'description'];

    public static function newFactory(): CollectionFactory
    {
        return CollectionFactory::new();
    }

    /**
     * @return HasMany
     */
    public function conditions(): HasMany
    {
        return $this->hasMany(CollectionCondition::class, 'collection_id');
    }

    /**
     * @return BelongsToMany
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'collection_products', 'collection_id', 'product_id');
    }

    /**
     * @throws Exception
     */
    public function smart_products(): Builder
    {
        $products = Product::query();
        if (!$this->relationLoaded('conditions')) {
            $this->load('conditions');
        }
        foreach ($this->conditions as $condition) {
            $products = $this->getProductsForCondition($products, $condition, $this->determiner);
        }
        return $products;
    }

    public function isManual(): bool
    {
        return $this->type === 'manual';
    }

    public function isAuto(): bool
    {
        return $this->type === 'auto';
    }

    /**
     * @param Builder $products
     * @param $condition
     * @param string $determiner
     * @return Builder
     * @throws Exception
     */
    public function getProductsForCondition(Builder $products, $condition, string $determiner = 'all'): Builder
    {
        $conditionManager = new CollectionCriteriaManager($condition);

        $field = $conditionManager->resolveField();
        $criteria = $conditionManager->resolveCriteria();
        $value = $conditionManager->resolveValue();

        $where = $determiner === 'all' ? 'where' : 'orWhere';
        $whereHas = $determiner === 'all' ? 'whereHas' : 'orWhereHas';

        if ($field === 'product_tag') {
            $products->$whereHas('tags', function ($query) use ($value, $criteria, $where) {
                $query->where('name', $criteria, $value);
            });
        } elseif ($field === 'product_type') {
            $products
                ->join('categories', 'categories.id', '=', 'products.category_id')
                ->$where('categories.name', $criteria, $value);
        } elseif ($field === 'vendor') {
            $products
                ->join('vendors', 'vendors.id', '=', 'products.vendor_id')
                ->where('vendors.name', $criteria, $value);
        } else {
            $products->$where('title', $criteria, $value);
        }

        return $products;
    }

    public function scopeOfName($query, $value)
    {
        return $query->where('name', $value);
    }
}
