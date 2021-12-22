<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use IZal\Lshopify\Database\Factories\FulfillmentFactory;

class Fulfillment extends BaseModel
{
    use HasFactory;

    protected $table = 'fulfillments';

    protected $guarded = ['id'];

    public static function newFactory()
    {
        return FulfillmentFactory::new();
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function variants()
    {
        return $this
            ->belongsToMany(Variant::class, 'fulfillment_variants', 'fulfillment_id', 'variant_id')
            ->withPivot(
                'id',
                'quantity',
                'price',
                'unit_price',
                'subtotal',
                'total',
                'status'
            );
    }

//    public function pending_variants()
//    {
//        return $this->variants()->where('status','pending');
//    }
//
//    public function success_variants()
//    {
//        return $this->variants()->where('status','success');
//    }

}
