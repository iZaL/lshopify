<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use IZal\Lshopify\Database\Factories\FulfillmentVariantFactory;

class FulfillmentVariant extends BaseModel
{
    use HasFactory;

    protected $table = 'fulfillment_variants';

    protected $fillable = ['order_id', 'variant_id', 'unit_price', 'total', 'subtotal', 'quantity', 'status'];

    public static function newFactory()
    {
        return FulfillmentVariantFactory::new();
    }

    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }

    public function fulfillment()
    {
        return $this->belongsTo(Fulfillment::class);
    }
}
