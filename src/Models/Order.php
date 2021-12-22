<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use IZal\Lshopify\Database\Factories\OrderFactory;

class Order extends BaseModel
{
    use HasFactory;
    protected $table = 'orders';

    protected $casts = [
        'total' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'price' => 'decimal:2',
        'unit_price' => 'decimal:2',
    ];

    public const STATUS_OPEN = 'open';
    public const STATUS_ARCHIVED = 'archived';
    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'total',
        'subtotal',
        'quantity',
        'currency',
        'customer_id',

        'contact_email',
        'contact_phone',

        'shipping_first_name',
        'shipping_last_name',
        'shipping_company',
        'shipping_address1',
        'shipping_address2',
        'shipping_city',
        'shipping_province',
        'shipping_street',
        'shipping_zip',
        'shipping_country',
        'shipping_phone',

        'billing_first_name',
        'billing_last_name',
        'billing_company',
        'billing_address1',
        'billing_address2',
        'billing_city',
        'billing_province',
        'billing_street',
        'billing_zip',
        'billing_country',
        'billing_phone',

        'draft',
        'status',
    ];

    protected static function boot()
    {
        parent::boot();
        static::addGlobalScope('draft', function (Builder $builder) {
            $builder->where('draft', 0);
        });
        static::creating(function ($model) {
            $model->draft = 0;
        });
    }

    public static function newFactory()
    {
        return OrderFactory::new();
    }
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function discounts()
    {
        //@todo: convert to belongsToMany Variant
        return $this->hasMany(Discount::class, 'order_id')->where('name', '!=', 'cart');
    }

    public function returns()
    {
        return $this->belongsToMany(Variant::class, 'order_returns', 'order_id', 'variant_id')->withPivot([
            'id',
            'quantity',
            'price',
            'unit_price',
            'subtotal',
            'total',
            'restock',
        ]);
    }

    public function cart_discount()
    {
        return $this->hasOne(Discount::class, 'order_id')->where('name', 'cart');
    }

    public function variants()
    {
        return $this->belongsToMany(Variant::class, 'order_variants', 'order_id', 'variant_id')->withPivot([
            'id',
            'quantity',
            'price',
            'unit_price',
            'subtotal',
            'total',
        ]);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'order_id');
    }

    public function success_payments()
    {
        return $this->transactions()
            ->where('kind', Transaction::KIND_SALE)
            ->where('status', Transaction::STATUS_SUCCESS);
    }

    /**
     * Check if there is any pending payment.
     * @return bool
     */
    public function isPaymentPending(): bool
    {
        $paidAmount = $this->success_payments()->sum('amount'); // 90
        $paymentOwed = $this->amount(); // 100

        return $paidAmount < $paymentOwed;
    }

    public function fulfillments()
    {
        return $this->hasMany(Fulfillment::class, 'order_id');
    }

    public function pending_fulfillments()
    {
        return $this->fulfillments()->whereHas('variants', function ($q) {
            $q->where('status', 'pending');
        });
    }

    public function success_fulfillments()
    {
        return $this->fulfillments()->whereHas('variants', function ($q) {
            $q->where('status', 'success');
        });
    }

//    public function fulfillment_variants()
//    {
//        return $this->hasManyThrough(FulfillmentVariant::class,Fulfillment::class);
//    }

//    public function pending_fulfillments()
//    {
//        return $this->hasManyThrough(FulfillmentVariant::class,Fulfillment::class)
//            ->where('status', 'pending');
//    }
//
//    public function success_fulfillments()
//    {
//        return $this->hasManyThrough(FulfillmentVariant::class,Fulfillment::class)
//            ->where('status', 'success');
//    }

    public function getShippingFullNameAttribute()
    {
        return $this->shipping_first_name ? \Str::title($this->shipping_first_name.' '.$this->shipping_last_name) : null;
    }

    public function getBillingFullNameAttribute()
    {
        return $this->billing_first_name ? \Str::title($this->billing_first_name.' '.$this->billing_last_name) : null;
    }

    public function draft(): bool
    {
        return $this->draft === 1;
    }

    /**
     * Return the total amount for the order.
     * @return float
     */
    public function amount()
    {
        return $this->total;
    }
}
