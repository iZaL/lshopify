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

    public function smart_products()
    {
        $conditions = $this->conditions;

        $products = Product::query();

//        foreach ($conditions as $condition) {
//            $field = ConditionFieldManager::resolve($condition->field);
//            $criteria = CollectionCriteriaManager::resolve($condition->criteria);
//            $value = $condition->value;
//            if($field === 'type') {
//                if($criteria === 'contains') {
//                    $products = $products
//                        ->join('categories as c','c.id', '=', 'products.category_id')
//                        ->where('c.name', 'LIKE', '%'.$value.'%'  )
//                    ;
//                }
//            } else {
//                $products = $products->where($field,$criteria,$value);
//            }
//        }

        $products = $products->get();

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

    public function getCriteriaSymbol()
    {
        $criterias = [];
    }

}
