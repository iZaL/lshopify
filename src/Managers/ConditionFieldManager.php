<?php

namespace IZal\Lshopify\Managers;

use IZal\Lshopify\Models\Collection;

class ConditionFieldManager
{

    public static function resolve(string $field): string
    {
        switch ($field) {
            case 'product_title':
                return 'title';
            case 'product_type':
                return 'type';
            default:
                throw new \Exception('Invalid field '.$field. ' passed into condition resolver');
        }
    }

}
