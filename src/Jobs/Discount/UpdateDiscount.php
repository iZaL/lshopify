<?php

namespace IZal\Lshopify\Jobs\Discount;

use Exception;
use IZal\Lshopify\Models\Discount;

class UpdateDiscount extends DiscountService
{
    /**
     * @throws Exception
     */
    public function run(Discount $discount, array $attributes): Discount
    {
        $discount = tap($discount)->update(
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
