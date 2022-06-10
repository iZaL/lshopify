<?php

namespace IZal\Lshopify\Events;

use IZal\Lshopify\Models\Customer;

class CustomerCreated
{
    public function __construct(Customer $customer)
    {
    }
}
