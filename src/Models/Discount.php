<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use IZal\Lshopify\Database\Factories\DiscountFactory;
use phpDocumentor\Reflection\Types\Boolean;

class Discount extends BaseModel
{
    use HasFactory;


    protected $table = 'discounts';

    protected $casts = [
        'once_per_customer' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    protected $fillable = [
        'title','code','type','value','value_type','target_type','min_requirement_type','min_requirement_value',
        'once_per_customer','usage_limit','customer_selection'
    ];

    public static function newFactory()
    {
        return DiscountFactory::new();
    }

    public function customers()
    {
        return $this->belongsToMany(Customer::class,'customer_discounts');
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
