<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transaction extends BaseModel
{
    use HasFactory;

    public const STATUS_SUCCESS = 'success';
    public const STATUS_PENDING = 'pending';
    public const STATUS_FAILURE = 'failure';
    public const STATUS_ERROR = 'error';

    public const KIND_SALE = 'sale';
    public const KIND_REFUND = 'refund';

    public const GATEWAY_MANUAL = 'manual';

    protected $table = 'transactions';

    protected $fillable = ['amount', 'parent_id', 'user_id', 'order_id', 'kind', 'gateway', 'currency', 'reference', 'payment_details', 'source', 'error_code', 'message', 'status'];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function parent()
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
