<?php

namespace IZal\Lshopify\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Arr;
use IZal\Lshopify\Database\Factories\CustomerAddressFactory;
use JetBrains\PhpStorm\Pure;

class CustomerAddress extends BaseModel
{
    use HasFactory;

    protected $table = 'customer_addresses';

    protected $casts = [];

    protected $fillable = [
        'customer_id',
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
        'default',
    ];

    public static function newFactory(): CustomerAddressFactory
    {
        return CustomerAddressFactory::new();
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * @param  array  $attributes
     * @param array $fillables
     * @return array
     */
    #[Pure]
    public static function parseShippingAddress(array $attributes, array $fillables): array {
        $shippingAttributes = [];
        foreach ($attributes as $key => $value) {
            $shippingAttributes['shipping_' . $key] = $value;
        }

        return Arr::only($shippingAttributes, $fillables);
    }

    /**
     * @param  array  $attributes
     * @param  array  $fillables
     * @return array
     */
    public static function parseBillingAddress(array $attributes, array $fillables): array
    {
        $billingAttributes = [];
        foreach ($attributes as $key => $value) {
            $billingAttributes['billing_' . $key] = $value;
        }

        return Arr::only($billingAttributes, $fillables);
    }
}
