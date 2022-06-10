<?php


namespace IZal\Lshopify\Traits;

use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

trait DateService
{

    public static function parseAttributes(array $attributes): Collection
    {
        return collect($attributes)
            ->except(['starts_at', 'ends_at'])
            ->merge(self::parseStartEndDates($attributes['starts_at'], $attributes['ends_at']));
    }

    /**
     * @param $startDate
     * @param $endDate
     * @return array
     * @throws Exception
     */
    protected static function parseStartEndDates($startDate, $endDate): array
    {
        [$startsAt, $endsAt] = self::validateDates($startDate, $endDate);

        return [
            'starts_at' => $startsAt->format('Y-m-d h:i:s'),
            'ends_at' => $endsAt->format('Y-m-d h:i:s'),
        ];
    }

    /**
     * Validate two dates
     * @throws Exception
     */
    private static function validateDates($startDate, $endDate): array
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
