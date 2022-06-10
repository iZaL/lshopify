<?php

namespace IZal\Lshopify\Events;

use IZal\Lshopify\Models\CustomerAddress;

class CustomerAddressCreated
{
    /**
     * @param CustomerAddress $address
     */
    public function __construct(CustomerAddress $address)
    {
    }
}
