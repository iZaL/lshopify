<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use IZal\Lshopify\Database\Factories\DiscountFactory;

class Discount extends BaseModel
{
    use HasFactory;

    protected $table = 'discounts';

    protected $casts = [
        'once_per_customer' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'auto' => 'boolean',
    ];

    protected $fillable = [
        'name',
        'auto',
        'value',
        'value_type',
        'target_type',
        'min_requirement_type',
        'min_requirement_value',
        'once_per_customer',
        'usage_limit',
        'customer_selection',
        'reason',
        'starts_at',
        'ends_at'
    ];

    public static function newFactory(): DiscountFactory
    {
        return DiscountFactory::new();
    }

    //    public function discountable(): \Illuminate\Database\Eloquent\Relations\MorphTo
    //    {
    //        return $this->morphTo();
    //    }

    public function customers(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(Customer::class, 'customer_discounts');
    }

    public function products(): MorphToMany
    {
        return $this->morphedByMany(Product::class, 'discountable');
    }

    public function variants(): MorphToMany
    {
        return $this->morphedByMany(Variant::class, 'discountable');
    }

    public function collections(): MorphToMany
    {
        return $this->morphedByMany(Collection::class, 'discountable');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'order_id');
    }
}
