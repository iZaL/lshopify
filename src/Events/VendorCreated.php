<?php

namespace IZal\Lshopify\Events;

use IZal\Lshopify\Models\Vendor;

class VendorCreated
{
    /**
     * @param Vendor $vendor
     */
    public function __construct(Vendor $vendor)
    {
    }
}
