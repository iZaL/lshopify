<?php

namespace IZal\Lshopify\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use IZal\Lshopify\Database\Factories\OrderFactory;
use IZal\Lshopify\Helpers\MoneyFormatter;
use IZal\Lshopify\Traits\DiscountService;
use Str;

class Order extends BaseModel
{
    use HasFactory;
    use MoneyFormatter;
    use DiscountService;

    protected $table = 'orders';

    protected $casts = [
        'total' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'price' => 'decimal:2',
        'unit_price' => 'decimal:2',
    ];

    protected $fillable = [
        'total',
        'subtotal',
        'quantity',
        'currency',
        'customer_id',
        'discount_id',

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

    public function discount()
    {
        return $this->belongsTo(Discount::class, 'discount_id');
    }

    public function variants()
    {
        return $this->belongsToMany(Variant::class, 'order_variants', 'order_id', 'variant_id')->withPivot([
            'id',
            'discount_id',
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
        $paidAmount = $this->success_payments->sum('amount'); // 90
        $paymentOwed = $this->amount;
        return $paidAmount < $paymentOwed;
    }

    public function workflows()
    {
        return $this->hasMany(Workflow::class, 'order_id');
    }

    public function success_fulfillments()
    {
        return $this->fulfillments()->where('status', Workflow::STATUS_SUCCESS);
    }

    public function fulfillments()
    {
        return $this->hasMany(Workflow::class, 'order_id')->where('type', Workflow::TYPE_FULFILLMENT);
    }

    public function refunds()
    {
        return $this->hasMany(Workflow::class, 'order_id')->where('type', Workflow::TYPE_REFUND);
    }

    public function returns()
    {
        return $this->hasMany(Workflow::class, 'order_id')->where('type', Workflow::TYPE_RETURNED);
    }

    public function getShippingFullNameAttribute()
    {
        return $this->shipping_first_name
            ? Str::title($this->shipping_first_name . ' ' . $this->shipping_last_name)
            : null;
    }

    public function getBillingFullNameAttribute()
    {
        return $this->billing_first_name
            ? Str::title($this->billing_first_name . ' ' . $this->billing_last_name)
            : null;
    }

    public function getDateAttribute()
    {
        return Carbon::parse($this->created_at)->format('M d, Y');
    }

    public function getDateTimeAttribute()
    {
        // format Sep 6 at 5:24 pm
        return Carbon::parse($this->created_at)->format('M d \a\t h:i a');
    }

    public function draft(): bool
    {
        return $this->draft === 1;
    }

    public function getAmountAttribute()
    {
        return $this->total;
    }

    public function removeDiscount()
    {
        $this->update(['discount_id' => null]);
    }

    /**
     * @param Customer $customer
     */
    public function attachCustomer(Customer $customer)
    {
        $this->update(['customer_id' => $customer->id]);
        $this->updateShippingAddress();
        $this->updateBillingAddress();
    }

    public function detachCustomer()
    {
        $this->update(['customer_id' => null]);
    }

    /**
     * @param  array  $attributes
     */
    public function updateShippingAddress(array $attributes = [])
    {
        $shippingAttributes = empty($attributes) ? $this->getShippingAddress() : $attributes;
        $attributes = CustomerAddress::parseShippingAddress($shippingAttributes, $this->getFillable());
        $this->update($attributes);
    }

    /**
     * @param array $attributes
     */
    public function updateBillingAddress(array $attributes = [])
    {
        $billingAttributes = empty($attributes) ? $this->getBillingAddress() : $attributes;
        $attributes = CustomerAddress::parseBillingAddress($billingAttributes, $this->getFillable());
        $this->update($attributes);
    }

    /**
     * @return array
     */
    public function getShippingAddress(): array
    {
        $order = $this;
        $customer = optional($order->customer);
        $defaultAddress = optional($customer->default_address);

        $fields = ['company', 'address1', 'address2', 'city', 'province', 'street', 'zip', 'country', 'phone'];

        $attributes = [
            'full_name' => $order->shipping_full_name ?? $customer->full_name,
            'first_name' => $order->shipping_first_name ?? $customer->first_name,
            'last_name' => $order->shipping_last_name ?? $customer->last_name,
        ];

        foreach ($fields as $field) {
            $attributes[$field] = $order->{'shipping_' . $field} ?? $defaultAddress->{$field};
        }

        return $attributes;
    }

    /**
     * @return array
     */
    protected function getBillingAddress(): array
    {
        $order = $this;
        $fields = [
            'full_name',
            'first_name',
            'last_name',
            'company',
            'address1',
            'address2',
            'city',
            'province',
            'street',
            'zip',
            'country',
            'phone',
        ];

        $shippingAttributes = $this->getShippingAddress();

        $attributes = [];
        foreach ($fields as $field) {
            $attributes[$field] = $order->{'billing_' . $field} ?? $shippingAttributes[$field];
        }

        return $attributes;
    }
}
