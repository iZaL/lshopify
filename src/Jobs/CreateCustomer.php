<?php

namespace IZal\Lshopify\Jobs;

use IZal\Lshopify\Models\Customer;

class CreateCustomer
{
    /**
     * @param array $attributes
     * @return Customer
     */
    public function run(array $attributes): Customer
    {
        return Customer::create(
            collect($attributes)
                ->only((new Customer())->getFillable())
                ->toArray()
        );
    }
}
