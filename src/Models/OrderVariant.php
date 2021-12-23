<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use IZal\Lshopify\Database\Factories\OrderVariantFactory;

class OrderVariant extends BaseModel
{
    use HasFactory;

    protected $table = 'order_variants';

    protected $casts = [];

    protected $fillable = ['order_id', 'variant_id', 'total', 'subtotal', 'unit_price', 'quantity', 'price'];

    public static function newFactory()
    {
        return OrderVariantFactory::new();
    }

    public function order()
    {
        return $this->belongsTo(DraftOrder::class);
    }

    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }

    public function discounts()
    {
        return $this->hasMany(Discount::class, 'variant_id');
    }

}
