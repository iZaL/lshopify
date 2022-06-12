<?php

namespace IZal\Lshopify\Events;

use IZal\Lshopify\Models\Discount;

class DiscountCreated
{
    public function __construct(Discount $discount)
    {
    }
}
