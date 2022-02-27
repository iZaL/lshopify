<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderReturn extends BaseModel
{
    use HasFactory;

    protected $table = 'order_returns';
    public $timestamps = false;

    protected $fillable = [
        'order_id',
        'variant_id',
        'restock',
        'price',
        'unit_price',
        'total',
        'subtotal',
        'quantity',
    ];

    public static function newFactory()
    {
    }
}
