<?php

namespace IZal\Lshopify\Models\Traits;

use IZal\Lshopify\Models\Discount;

trait DiscountableTrait
{
    public function discounts()
    {
        return $this->morphMany(Discount::class, 'discountable');
    }

    public function discount()
    {
        return $this->morphOne(Discount::class, 'discountable');
    }
}
