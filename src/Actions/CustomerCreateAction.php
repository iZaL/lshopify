<?php

namespace IZal\Lshopify\Actions;

use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\CustomerAddress;
use Illuminate\Support\Arr;

class CustomerCreateAction
{
    /**
     * @var Customer
     */
    private $customer;
    /**
     * @var CustomerAddress
     */
    private $customerAddress;

    /**
     * CategoryCreateAction constructor.
     */
    public function __construct(
        Customer $customer,
        CustomerAddress $customerAddress
    ) {
        $this->customer = $customer;
        $this->customerAddress = $customerAddress;
    }

    public function create(array $attributes): Customer
    {
        return $this->customer->create(
            collect($attributes)
                ->only($this->customer->getFillable())
                ->toArray()
        );
    }

    public function createCustomerAddress(
        Customer $customer,
        array $attributes
    ): \Illuminate\Database\Eloquent\Model {
        return $customer
            ->addresses()
            ->create(
                Arr::only($attributes, $this->customerAddress->getFillable())
            );
    }
}
