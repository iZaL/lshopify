<?php

namespace IZal\Lshopify\Jobs\Discount;

use IZal\Lshopify\Models\Discount;
use IZal\Lshopify\Traits\DateService;

class CreateDiscount
{
    private array $attributes;

    public function __construct(array $attributes)
    {
        $this->attributes = $attributes;
    }

    public function handle(): Discount
    {
        $attributes = $this->attributes;

        $discount = Discount::create(
            DateService::parseAttributes($attributes)
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
