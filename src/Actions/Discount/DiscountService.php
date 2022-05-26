<?php

namespace IZal\Lshopify\Actions\Discount;

use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class DiscountService
{

    public function parseAttributes(array $attributes): Collection
    {
        return collect($attributes)
            ->except(['starts_at','ends_at'])
            ->merge($this->parseStartEndDates($attributes['starts_at'],$attributes['ends_at']));
    }

    /**
     * @param $startDate
     * @param $endDate
     * @return array
     * @throws Exception
     */
    protected function parseStartEndDates($startDate, $endDate): array
    {
        [$startsAt, $endsAt] = $this->validateDates($startDate, $endDate);

        return [
            'starts_at' => $startsAt->format('Y-m-d h:i:s'),
            'ends_at' => $endsAt->format('Y-m-d h:i:s')
        ];
    }

    /**
     * Validate two dates
     * @throws Exception
     */
    private function validateDates($startDate,$endDate): array
    {
        $startsAt = Carbon::parse($startDate);
        $endsAt = Carbon::parse($endDate);

        if ($startsAt->isPast()) {
            throw new Exception('Start date must be in future');
        }

        if ($startsAt->gt($endsAt)) {
            throw new Exception('End date must be greater than start date');
        }

        return [$startsAt, $endsAt];
    }

}
