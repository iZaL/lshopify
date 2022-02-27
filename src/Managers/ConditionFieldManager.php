<?php

namespace IZal\Lshopify\Managers;

use IZal\Lshopify\Models\Collection;

class ConditionFieldManager
{
    public static function resolve(string $field): string
    {
        $allowedFields = [
            'product_title',
            'product_type',
            'product_tag',
            'price',
            'compare_at_price',
            'weight',
            'stock',
            'variant_title',
        ];

        if (!in_array($field, $allowedFields)) {
            throw new \Exception(
                'Invalid field ' . $field . ' passed into condition resolver'
            );
        }

        return $field;
    }
}
