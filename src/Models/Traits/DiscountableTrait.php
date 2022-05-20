<?php

namespace IZal\Lshopify\Models\Traits;

use IZal\Lshopify\Models\Discount;

trait DiscountableTrait
{
    public function discounts()
    {
        return $this->morphToMany(Discount::class, 'discountable');
    }
}
