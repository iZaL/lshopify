<?php

namespace IZal\Lshopify\Cart\Collections;

use IZal\Lshopify\Cart\Collection;
use Illuminate\Support\Arr;

abstract class BaseCollection extends Collection
{
    /**
     * Holds all the conditions.
     *
     * @var array
     */
    protected $conditions = [];

    /**
     * Holds the conditions results.
     *
     * @var array
     */
    protected $conditionResults = [];

    /**
     * Holds the item price.
     *
     * @var float
     */
    protected $price;

    /**
     * Holds the item subtotal.
     *
     * @var float
     */
    protected $subtotal;

    /**
     * {@inheritdoc}
     */
    public function get($key, $default = null)
    {
        if ($key === 'subtotal') {
            return $this->subtotal();
        }

        return parent::get($key, $default);
    }

    /**
     * Returns the conditions order.
     *
     * @return array
     */
    public function getConditionsOrder()
    {
        return $this->conditionsOrder;
    }

    /**
     * Sets the conditions order.
     *
     * @param array $order
     *
     * @return void
     */
    public function setConditionsOrder(array $order)
    {
        $this->conditionsOrder = $order;
    }

    /**
     * Sets a new condition.
     *
     * @param mixed $conditions
     *
     * @return void
     */
    public function condition($conditions)
    {
        if (empty($conditions)) {
            return;
        }

        if (!is_array($conditions)) {
            $conditions = [$conditions];
        }

        foreach ($conditions as $condition) {
            $this->conditions[$condition->get('name')] = $condition;
        }
    }

    /**
     * Clear the conditions.
     *
     * @param  string|null  $id
     *
     * @return void
     */
    public function removeConditions(string $id = null, bool $includeItems = true, string $target = 'type')
    {
        if ($id) {
            foreach ($this->conditions as $key => $value) {
                if ($value[$target] === $id) {
                    unset($this->conditions[$key]);
                }
            }
        } else {
            $this->conditions = [];
        }
    }

    /**
     * Returns the total.
     *
     * @param string $conditionType
     *
     * @return float
     */
    public function total($conditionType = null)
    {
        $this->conditionResults = [];

        $this->subtotal = $this->subtotal();

        $this->price = $this->get('price');

        // Price conditions
        foreach ($this->getConditionsOrder() as $type) {
            $this->price += $this->applyCondition($type, 'price', $this->price);
        }

        $this->subtotal = $this->subtotal($this->price);

        // Subtotal conditions
        foreach ($this->getConditionsOrder() as $type) {
            $this->subtotal += $this->applyCondition($type, 'subtotal', $this->subtotal);

            if ($conditionType === $type) {
                break;
            }
        }

        return $this->subtotal;
    }

    /**
     * Apply a condition.
     *
     * @param string $conditionType
     * @param string $target
     * @param int    $value
     *
     * @return float
     */
    public function applyCondition($conditionType, $target = 'subtotal', $value = 0)
    {
        $subtotal = 0;

        foreach ($this->conditions($conditionType) as $condition) {
            if ($condition->get('target') === $target) {
                $name = $condition->get('name');

                $type = $condition->get('type');

                if (!$value) {
                    $this->conditionResults[$type][$name] = 0;

                    continue;
                }

                $condition->apply($this, $value);

                $result = $condition->result();

                if (empty($this->conditionResults[$type])) {
                    $this->conditionResults[$type] = [];
                }

                if ($target === 'price') {
                    $this->conditionResults[$type][$name] = $result * $this->get('quantity');
                } else {
                    $this->conditionResults[$type][$name] = $result;
                }

                if ($result && !head($condition->get('actions'))->get('inclusive')) {
                    $subtotal += $result;
                }
            }
        }

        return $subtotal;
    }

    /**
     * Returns all the conditions sum grouped by type.
     *
     * When passing a boolean true as the second parameter,
     * it will include the items discounts as well.
     *
     * @param string $type
     * @param bool   $includeItems
     *
     * @return array
     */
    public function conditionsTotal($type = null, $includeItems = true)
    {
        $this->conditionResults = [];

        $this->total();

        if ($includeItems) {
            foreach ($this->items as $item) {
                $this->conditionResults = array_merge_recursive($item->conditionResults(), $this->conditionResults);
            }
        }

        if ($type && empty($this->conditionResults[$type])) {
            return [];
        }

        foreach ($this->conditionResults as $key => $result) {
            foreach ($result as $name => $value) {
                if (is_array($value)) {
                    $this->conditionResults[$key][$name] = array_sum($value);
                }
            }
        }

        return Arr::get($this->conditionResults, $type, $this->conditionResults);
    }

    /**
     * Returns the sum of conditions.
     *
     * @param string $type
     * @param bool   $includeItems
     *
     * @return float
     */
    public function conditionsTotalSum($type = null, $includeItems = true)
    {
        if (!$type) {
            return array_sum(
                array_map(function ($item) {
                    return is_array($item) ? array_sum($item) : $item;
                }, $this->conditionsTotal($type, $includeItems))
            );
        }

        return array_sum($this->conditionsTotal($type, $includeItems));
    }

    /**
     * Returns all the conditions with the given type.
     *
     * @param string $type
     *
     * @return array
     */
    public function conditions($type = null)
    {
        $conditions = [];

        foreach ($this->conditions as $condition) {
            if ($type) {
                if ($type === $condition->get('type')) {
                    $conditions[] = $condition;
                }

                continue;
            }

            $conditions[] = $condition;
        }

        return $conditions;
    }
}
