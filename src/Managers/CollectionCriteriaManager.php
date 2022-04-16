<?php

namespace IZal\Lshopify\Managers;

class CollectionCriteriaManager
{
    protected $condition;

    /**
     * @param null $condition
     */
    public function __construct($condition = null)
    {
        $this->condition = $condition;
    }

    public function resolveField(): string
    {
        $field = $this->condition->field;

        $allowedFields = [
            'product_title',
            'product_type',
            'product_tag',
            'price',
            'compare_at_price',
            'weight',
            'stock',
            'variant_title',
            'vendor',
        ];

        if (!in_array($field, $allowedFields)) {
            throw new \Exception('Invalid field ' . $field . ' passed into condition resolver');
        }

        return $field;
    }

    public function resolveCriteria()
    {
        $criteria = $this->condition->criteria;

        switch ($criteria) {
            case 'is_not_equal_to':
                return '!=';
            case 'is_equal_to':
                return '=';
            case 'is_greater_than':
                return '>';
            case 'is_less_than':
                return '<';
            case 'ends_with':
            case 'contains':
            case 'starts_with':
                return 'LIKE';
            case 'does_not_contain':
                return 'NOT LIKE';
            case 'is_not_empty':
                return 'IS NOT NULL';
            case 'is_empty':
                return 'IS NULL';
            default:
                throw new \Exception('Invalid criteria ' . $criteria . ' passed to the resolver');
        }
    }

    public function resolveValue()
    {
        $criteria = $this->condition->criteria;
        $value = $this->condition->value;
        switch ($criteria) {
            case 'ends_with':
                return '%' . $value;
            case 'contains':
                return '%' . $value . '%';
            case 'starts_with':
                return $value . '%';
            default:
                return $value;
        }
    }

    public function getClause($determiner = 'all')
    {
        $field = $this->resolveField();
        $criteria = $this->resolveCriteria();
        $value = $this->resolveValue();

        $clause = $field . ' ' . $criteria . ' ' . $value;

        if ($determiner == 'any') {
            $clause = 'OR ' . $clause;
        }

        return $clause;
    }
}
