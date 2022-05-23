<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderReturn extends BaseModel
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'order_returns';

    protected $fillable = ['order_id', 'variant_id', 'restock', 'price', 'unit_price', 'total', 'subtotal', 'quantity'];

    public static function newFactory()
    {
    }
}
