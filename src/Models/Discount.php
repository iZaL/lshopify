<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Discount extends BaseModel
{
    use HasFactory;

    protected $table = 'discounts';

    protected $casts = [];

    protected $fillable = ['order_id', 'variant_id', 'value', 'suffix', 'reason', 'name', 'target', 'reason'];

    public static function newFactory()
    {
//        return DiscountFactory::new();
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }
}
