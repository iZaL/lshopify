<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use IZal\Lshopify\Database\Factories\WorkflowFactory;

class Workflow extends BaseModel
{
    use HasFactory;

    public const TYPE_FULFILLMENT = 'fulfilled';
    public const TYPE_REFUND = 'refund';
    public const TYPE_RETURNED = 'returned';
    public const TYPE_REMOVED = 'removed';

    public const STATUS_PENDING = 'pending';
    public const STATUS_SUCCESS = 'success';
    public const STATUS_CANCELLED = 'cancelled';

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

    public function getVariantsCountAttribute()
    {
        //        dd($this->variants()->withPivot('quantity')->sum('pivot.quantity'));
        return $this->variants()->sum('workflow_variants.quantity');
    }

    public function variants()
    {
        return $this->belongsToMany(Variant::class, 'workflow_variants', 'workflow_id', 'variant_id')->withPivot(
            'id',
            'quantity',
            'price',
            'unit_price',
            'subtotal',
            'total'
        );
    }

    public function getTitleAttribute()
    {
        $type = $this->type;
        $status = $this->status;
        $title = $type;
        $variantsCount = ' (' . $this->variants_count . ')';
        switch ($type) {
            case self::TYPE_RETURNED:
                $title = $status === self::STATUS_SUCCESS ? $title : 'Return in progress ' . $variantsCount;
                break;
            default:
                $title = $title . $variantsCount;
                break;
        }
        return ucfirst($title);
    }
}
