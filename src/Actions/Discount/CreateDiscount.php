<?php

namespace IZal\Lshopify\Actions\Discount;

use IZal\Lshopify\Models\Discount;

class CreateDiscount extends DiscountService
{

    public function run(array $attributes): Discount
    {
        $discount = Discount::create(
            $this->parseAttributes($attributes)
                ->only((new Discount())->getFillable())
                ->toArray()
        );

        if ($discount->target_type === 'products' && isset($attributes['variants'])) {
            $discount->variants()->sync($attributes['variants']);
        }

        if ($discount->target_type === 'collections' && isset($attributes['collections'])) {
            $discount->collections()->sync($attributes['collections']);
        }

        if (isset($attributes['customers'])) {
            $discount->customers()->sync($attributes['customers']);
        }

        return $discount;
    }
}
