<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use IZal\Lshopify\Database\Factories\WorkflowFactory;

class Workflow extends BaseModel
{
    use HasFactory;

    public const TYPE_FULFILLMENT = 'fulfilled';
    public const TYPE_REFUND = 'refund';
    public const TYPE_RETURNED = 'returned';
    public const TYPE_REMOVED = 'removed';

    protected $table = 'workflows';

    protected $guarded = ['id'];

    public static function newFactory()
    {
        return WorkflowFactory::new();
    }

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function variants()
    {
        return $this->belongsToMany(
            Variant::class,
            'workflow_variants',
            'workflow_id',
            'variant_id'
        )->withPivot(
            'id',
            'quantity',
            'price',
            'unit_price',
            'subtotal',
            'total'
        );
    }
}
