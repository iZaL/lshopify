<?php

namespace IZal\Lshopify\Jobs;

use IZal\Lshopify\Events\CustomerAddressCreated;
use IZal\Lshopify\Events\CustomerCreated;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\CustomerAddress;

class CreateCustomer
{
    private array $attributes;

    public function __construct(array $attributes)
    {
        $this->attributes = $attributes;
    }

    /**
     * @return Customer
     */
    public function handle(): Customer
    {
        $attributes = $this->attributes;
        $customer = new Customer();
        $customer->fill($attributes['customer']);
        $customer->save();

        event(new CustomerCreated($customer));

        if (!$customer->addresses()->count()) {
            $attributes['address']['default'] = 1;
        }

        $address = new CustomerAddress();
        $address->fill($attributes['address']);
        $address->save();

        $customer->addresses()->save($address);

        event(new CustomerAddressCreated($address));

        return $customer;
    }
}
