<?php

namespace IZal\Lshopify\Helpers;

use Illuminate\Support\Str;

trait MoneyFormatter
{
    public function __get($key)
    {
        $hasFormatter = Str::contains($key, '_formatted');

        if ($hasFormatter) {
            $key = Str::replaceLast('_formatted', '', $key);
            if ($this->attributes[$key]) {
                return $this->formatMoney($key);
            }
            return parent::__get($key);
        }

        return parent::__get($key);
    }

    public function formatMoney($key)
    {
        $value = $this->attributes[$key];
        return 'OMR ' . number_format($value, 2);
    }

    public static function localize($price)
    {
        return 'OMR ' . number_format($price, 2);
    }

}
