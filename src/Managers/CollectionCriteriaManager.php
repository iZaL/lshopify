<?php

namespace IZal\Lshopify\Managers;

use IZal\Lshopify\Models\Collection;

class CollectionCriteriaManager
{

    public static function resolve(string $criteria)
    {
        switch ($criteria) {
            case 'is_not_equal_to':
                return '!=';
            case 'is_equal_to':
                return '=';
            case 'contains':
                return 'contains';
            default:
                throw new \Exception('Invalid criteria '.$criteria. ' passed to the resolver');
        }
    }

}
