<?php

namespace IZal\Lshopify\Helpers;

use Illuminate\Support\Str;
use IZal\Lshopify\Models\Tag;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

trait MoneyFormatter
{
    public function __get($key)
    {
        $hasFormatter = Str::contains($key, '_formatted');

        if($hasFormatter) {
            $key = Str::replaceLast('_formatted', '', $key);
            if($this->attributes[$key]) {
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
}
