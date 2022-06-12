<?php

namespace IZal\Lshopify\Jobs\Discount;

use IZal\Lshopify\Events\DiscountCreated;
use IZal\Lshopify\Models\Discount;
use IZal\Lshopify\Helpers\DateHelper;

class CreateDiscount
{
    private array $attributes;

    public function __construct(array $attributes)
    {
        $this->attributes = $attributes;
    }

    public function handle(): Discount
    {

        $parsedDates = DateHelper::parseStartEndDates($this->attributes['starts_at'],$this->attributes['ends_at']);

        $attributes = collect($this->attributes)->except(['starts_at', 'ends_at']);

        $discount = new Discount();
        $discount->fill([
            ...$attributes,
            ...$parsedDates
        ]);

        $discount->save();

        if ($discount->target_type === 'products' && isset($attributes['variants'])) {
            $discount->variants()->sync($attributes['variants']);
        }

        if ($discount->target_type === 'collections' && isset($attributes['collections'])) {
            $discount->collections()->sync($attributes['collections']);
        }

        if (isset($attributes['customers'])) {
            $discount->customers()->sync($attributes['customers']);
        }

        event(new DiscountCreated($discount));
        return $discount;
    }
}
