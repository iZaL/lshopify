<?php

namespace IZal\Lshopify\Events;

use IZal\Lshopify\Models\Discount;

class DiscountUpdated
{

    public function __construct(Discount $discount)
    {
    }
}
