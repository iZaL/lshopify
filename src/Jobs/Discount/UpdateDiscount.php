<?php

namespace IZal\Lshopify\Jobs\Discount;

use Exception;
use IZal\Lshopify\Models\Discount;
use IZal\Lshopify\Helpers\DateHelper;

class UpdateDiscount
{
    private Discount $discount;
    private array $attributes;

    public function __construct(Discount $discount, array $attributes)
    {
        $this->discount = $discount;
        $this->attributes = $attributes;
    }
    /**
     * @throws Exception
     */
    public function handle(): Discount
    {
        $discount = $this->discount;

        $parsedDates = DateHelper::parseStartEndDates($this->attributes['starts_at'],$this->attributes['ends_at']);

        $attributes = collect($this->attributes)->except(['starts_at', 'ends_at']);

        $discount = tap($discount)->update([
            ...$attributes,
            ...$parsedDates
        ]);

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
