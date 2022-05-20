<?php

namespace IZal\Lshopify\Actions;

use Illuminate\Database\Eloquent\Model;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\CustomerAddress;
use Illuminate\Support\Arr;

class CreateCustomerAddress
{

    /**
     * @param Customer $customer
     * @param array $attributes
     * @return Model
     */
    public function run(Customer $customer, array $attributes): Model
    {
        if (!$customer->addresses()->count()) {
            $attributes['default'] = 1;
        }
        return $customer->addresses()->create(Arr::only($attributes, (new CustomerAddress())->getFillable()));
    }

}
