<?php

namespace IZal\Lshopify\Tests\Cart;

use IZal\Lshopify\Cart\Condition;
use Illuminate\Foundation\Testing\RefreshDatabase;
use IZal\Lshopify\Tests\TestCase;

abstract class CartTestCase extends TestCase
{
    use RefreshDatabase;

    /**
     * Holds the cart instance.
     *
     * @var \IZal\Lshopify\Cart\Cart
     */
    protected $cart;

    /**
     * Setup resources and dependencies.
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->cart = app('cart');
    }

    /**
     * Creates an item.
     *
     * @param string $name
     * @param float  $price
     * @param int    $quantity
     * @param array  $conditions
     * @param array  $attrPrices
     * @param int    $weight
     *
     * @return array
     */
    protected function createItem(
        $name = 'Foobar',
        $price = 0,
        $quantity = 1,
        $conditions = [],
        $attrPrices = [0, 0],
        $weight = 0
    ) {
        return [
            'id'         => strtolower(str_replace(' ', '', $name)),
            'name'       => $name,
            'quantity'   => $quantity,
            'conditions' => $conditions,
            'price'      => $price,
            'weight'     => $weight,
            'attributes' => [
                'size' => [
                    'label' => 'Large',
                    'value' => 'l',
                    'price' => $attrPrices[0] ?? 0,
                ],
                'color' => [
                    'label' => 'Red',
                    'value' => 'red',
                    'price' => $attrPrices[1] ?? 0,
                ],
            ],
        ];
    }

    /**
     * Creates a condition.
     *
     * @param string $name
     * @param string $type
     * @param int    $value
     * @param string $target
     * @param array  $rules
     * @param bool   $inclusive
     *
     * @return \IZal\Lshopify\Cart\Condition
     */
    protected function createCondition(
        $name,
        $type,
        $value,
        $target = 'subtotal',
        $rules = null,
        $inclusive = false
    ) {
        $condition = new Condition(compact('name', 'type', 'target'));

        if (is_array($value)) {
            $actions = [];

            foreach ($value as $val) {
                $actions[]['value'] = $val;
            }

            $actions[]['inclusive'] = $inclusive;
        } else {
            $actions = compact('value', 'inclusive');
        }

        $condition->setActions($actions);

        if ($rules) {
            $condition->setRules([
                $rules,
            ]);
        }

        return $condition;
    }
}
