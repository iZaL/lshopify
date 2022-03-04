<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use IZal\Lshopify\Database\Factories\CollectionFactory;
use IZal\Lshopify\Managers\CollectionCriteriaManager;
use IZal\Lshopify\Managers\ConditionFieldManager;

class Collection extends BaseModel
{
    use HasFactory;
    use ImageableTrait;

    protected $table = 'collections';
    public $timestamps = false;

    protected $fillable = ['name', 'slug', 'type', 'determiner'];

    public static function newFactory()
    {
        return CollectionFactory::new();
    }

    public function conditions()
    {
        return $this->hasMany(CollectionCondition::class, 'collection_id');
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'collection_products', 'collection_id', 'product_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection
     * @throws \Exception
     */
    public function smart_products()
    {
        $products = Product::query();
        if (!$this->relationLoaded('conditions')) {
            $this->load('conditions');
        }
        foreach ($this->conditions as $condition) {
            $products = $this->getProductsForCondition($products, $condition, $this->determiner);
        }
        return $products->get();
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
     * @param \Illuminate\Database\Eloquent\Builder $products
     * @param $condition
     * @param string $determiner
     * @throws \Exception
     */
    public function getProductsForCondition(
        \Illuminate\Database\Eloquent\Builder $products,
        $condition,
        string $determiner = 'all'
    ): \Illuminate\Database\Eloquent\Builder {
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
        } else {
            $products->$where('title', $criteria, $value);
        }

        return $products;
    }
}
