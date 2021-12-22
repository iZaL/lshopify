<?php

namespace IZal\Lshopify\Tests\Cart;

class CartTestConditions extends CartTestCase
{
    /** @test */
    public function cart_handles_all_defined_condition_types()
    {
        $discount = $this->createCondition('Discount 5%', 'discount', '-5.00%');
        $other = $this->createCondition('Other 5', 'other', 5, 'price');
        $tax = $this->createCondition('Tax 10%', 'tax', '10%');

        $item = $this->cart->add(
            $this->createItem('Foobar 1', 100, 5, [$discount, $other, $tax])
        );

        $this->assertSame($item->total('discount'), 498.75);
        $this->assertSame($item->subtotal(), 500.00);
        $this->assertSame($item->conditionsTotalSum('discount'), -26.25);
        $this->assertSame($item->conditionsTotalSum('tax'), 49.875);
        $this->assertSame($item->total(), 548.625);

        $this->assertCount(3, $item->conditions());
        $this->assertCount(1, $item->conditions('discount'));
        $this->assertCount(3, $this->cart->itemsConditions());

        $this->assertSame($this->cart->itemsConditionsTotalSum('discount', false), -26.25);
        $this->assertSame($this->cart->itemsConditionsTotalSum('tax'), 49.875);
        $this->assertSame($this->cart->itemsSubtotal(), 500.00);
        $this->assertSame($this->cart->subtotal(), 548.625);
        $this->assertSame($this->cart->total(), 548.625);

        $this->cart->condition($tax);

        $this->assertCount(4, $this->cart->conditions());
        $this->assertCount(1, $this->cart->conditions(null, false));

        $this->assertSame($this->cart->itemsConditionsTotalSum(), 48.625);
        $this->assertSame($this->cart->itemsConditionsTotalSum('discount'), -26.25);
        $this->assertSame($this->cart->itemsConditionsTotalSum('other'), 25.00);
        $this->assertSame($this->cart->itemsConditionsTotalSum('tax'), 49.875);

        $this->assertSame($this->cart->conditionsTotalSum(), 103.4875);
        $this->assertSame($this->cart->conditionsTotalSum('discount'), -26.25);
        $this->assertSame($this->cart->conditionsTotalSum('other'), 25.00);
        $this->assertSame($this->cart->conditionsTotalSum('tax'), 104.7375);

        $this->cart->condition($discount);

        $this->assertSame($this->cart->conditionsTotalSum(), 73.313125);
        $this->assertSame($this->cart->conditionsTotalSum('discount'), -53.68125);
        $this->assertSame($this->cart->conditionsTotalSum('other'), 25.00);
        $this->assertSame($this->cart->conditionsTotalSum('tax'), 101.994375);

        $item->removeConditions('tax');

        $this->assertSame($item->total(), 498.75);

        $item->removeConditions();

        $this->assertSame($item->total(), 500.00);
    }

    /** @test */
    public function cart_calculates_condition_totals()
    {
        $discount = $this->createCondition('Discount 5%', 'discount', '-5%');
        $other1 = $this->createCondition('Add5', 'other', 5, 'price');
        $other2 = $this->createCondition('Add5%', 'other', '5%', 'price');
        $other3 = $this->createCondition('Other 10%', 'other', '10%');
        $tax = $this->createCondition('Tax 10%', 'tax', '10%');

        $this->cart->add(
            $this->createItem('Foobar', 100, 5, [$other1, $other2])
        );

        $this->cart->condition([$discount, $other3, $tax]);

        $this->assertSame($this->cart->total(), 632.225);
    }

    /** @test */
    public function cart_applies_tax_on_price()
    {
        $tax = $this->createCondition('Tax 5%', 'tax', '5%', 'price');
        $shipping = $this->createCondition('Shipping', 'shipping', '10%');

        $item = $this->cart->add(
            $this->createItem('Foobar', 100, 5, $tax)
        );

        $this->assertSame($item->conditionsTotalSum('tax'), 25.00);
        $this->assertSame($item->total(), 525.00);

        $item->condition($shipping);

        $item->setConditionsOrder([
            'tax',
            'shipping',
        ]);

        $this->assertSame($item->total(), 577.50);

        $item->setConditionsOrder([
            'tax',
            'other',
            'discount',
        ]);

        $this->assertSame($item->total(), 525.00);
    }

    /** @test */
    public function cart_applies_conditions_on_items()
    {
        $discount = $this->createCondition('Discount 10%', 'discount', '-10', 'subtotal', 'price <= 125');

        $items = $this->cart->add([
            $this->createItem('Foobar 1', 97, 1, $discount, [0, 3]),
            $this->createItem('Foobar 2', 85, 1, $discount, [15, 0]),
        ]);

        $this->assertSame($items[0]->total(), 90.00);
        $this->assertSame($items[1]->total(), 90.00);
        $this->assertSame($this->cart->itemsSubtotal(), 200.00);
        $this->assertSame($this->cart->total(), 180.00);
    }

    /** @test */
    public function cart_applies_conditions_on_cart()
    {
        $discount = $this->createCondition('Discount 10%', 'discount', '-10%');
        $tax1 = $this->createCondition('Tax 10%', 'tax', '10%');
        $tax2 = $this->createCondition('Tax 12%', 'tax', '12%');

        $this->cart->add(
            $this->createItem('Foobar', 125, 1, $tax1, [0, 3])
        );

        $this->cart->condition([$discount, $tax2]);

        $this->assertSame($this->cart->total(), 141.9264);
        $this->assertSame($this->cart->subtotal(), 140.80);
    }

    /** @test */
    public function cart_handles_conditions_with_no_action()
    {
        $condition = $this->createCondition('Free product', 'other', null);

        $condition->forget('actions');

        $this->cart->add(
            $this->createItem('Foobar', 125, 2)
        );

        $this->cart->condition($condition);

        $this->assertSame($this->cart->total(), 250.00);
        $this->assertSame($this->cart->subtotal(), 250.00);
    }

    /** @test */
    public function cart_calculates_item_total()
    {
        $tax = $this->createCondition('Tax 10%', 'tax', '10%');

        $item = $this->cart->add(
            $this->createItem('Foobar', 125, 2, $tax, [3, 3])
        );

        $this->assertSame($item->subtotal(), 262.00);
        $this->assertSame($item->total(), 288.2);
    }

    /** @test */
    public function cart_applies_multiple_conditions_on_items()
    {
        $discount = $this->createCondition('Discount 5% + 2', 'discount', ['-5%', '-2']);
        $tax = $this->createCondition('Tax 10%', 'tax', '10%');

        $item = $this->cart->add(
            $this->createItem('Foobar', 125, 2, [$tax, $discount], [0, 3])
        );

        $this->assertSame($item->subtotal(), 256.00);
        $this->assertSame($item->total(), 265.32);
    }

    /** @test */
    public function cart_applies_tax_conditions()
    {
        $discount = $this->createCondition('Discount 5%', 'discount', '-5%');
        $other = $this->createCondition('Other 5', 'other', '5', 'price');
        $tax1 = $this->createCondition('Tax 10%', 'tax', '10%');
        $tax2 = $this->createCondition('Tax 5%', 'tax', '5%');

        $items = $this->cart->add([
            $this->createItem('Foobar 1', 97, 2, $tax1, [0, 3]),
            $this->createItem('Foobar 2', 85, 2, [$discount, $other, $tax1, $tax2]),
        ]);

        $this->assertSame($items[0]->subtotal(), 200.00);
        $this->assertSame($items[0]->conditionsTotalSum('tax'), 20.00);
        $this->assertSame($items[0]->conditionsTotalSum('discount'), 0);
        $this->assertSame($items[0]->total(), 220.00);

        $this->assertSame($items[1]->subtotal(), 170.00);
        $this->assertSame($items[1]->conditionsTotalSum('tax'), 25.65);
        $this->assertSame($items[1]->conditionsTotalSum('discount'), -9.00);
        $this->assertSame($items[1]->total(), 196.65);

        $this->cart->condition($tax2);

        $this->assertSame($this->cart->subtotal(), 416.65);
        $this->assertSame($this->cart->itemsSubtotal(), 370.00);
        $this->assertSame($this->cart->total(), 437.4825);
        $this->assertSame($this->cart->conditionsTotalSum('tax', false), 20.8325);
        $this->assertSame($this->cart->conditionsTotalSum('tax'), 66.4825);
        $this->assertSame($this->cart->conditionsTotalSum('discount'), -9.00);
        $this->assertSame($this->cart->itemsConditionsTotalSum('tax'), 45.65);
    }

    /** @test */
    public function cart_applies_multiple_types_of_conditions_on_items()
    {
        $discount = $this->createCondition('Discount 10%', 'discount', '-10%', 'price');
        $other1 = $this->createCondition('Other 5', 'other', '5%', 'price');
        $other2 = $this->createCondition('Other 5', 'other', '5%');
        $tax = $this->createCondition('Tax 10%', 'tax', '10%');

        $items = $this->cart->add([
            $this->createItem('Foobar 1', 100, 4, $discount, [0, 3]),
            $this->createItem('Foobar 2', 100, 2, [$discount, $other1], [15, 0]),
        ]);

        $this->assertSame($items[0]->subtotal(), 412.00);
        $this->assertSame($items[0]->conditionsTotalSum('discount'), -40.00);
        $this->assertSame($items[0]->total(), 372.00);

        $this->assertSame($items[1]->subtotal(), 230.00);
        $this->assertSame($items[1]->conditionsTotalSum('discount'), -20.00);
        $this->assertSame($items[1]->total(), 219.00);

        $this->assertSame($this->cart->subtotal(), 591.00);
        $this->assertSame($this->cart->itemsSubtotal(), 642.00);
        $this->assertSame($this->cart->total(), 591.00);

        $this->cart->condition($tax);

        $this->assertSame($this->cart->subtotal(), 591.00);
        $this->assertSame($this->cart->total(), 650.10);

        $this->cart->condition($other2);

        $this->assertSame($this->cart->subtotal(), 591.00);
        $this->assertSame($this->cart->total(), 682.605);
    }

    /** @test */
    public function cart_applies_conditions_on_item_price()
    {
        $other = $this->createCondition('Other 5', 'other', '5', 'price');
        $tax = $this->createCondition('Tax 10%', 'tax', '10%');

        $item = $this->cart->add(
            $this->createItem('Foobar', 125, 3, $other, [3, 3])
        );

        $this->assertSame($item->subtotal(), 393.00);
        $this->assertSame($item->total(), 408.00);
        $this->assertSame($this->cart->subtotal(), 408.00);
        $this->assertSame($this->cart->total(), 408.00);

        $this->cart->condition($tax);

        $this->assertSame($this->cart->subtotal(), 408.00);
        $this->assertSame($this->cart->total(), 448.80);
    }

    /** @test */
    public function cart_ignores_item_conditions_if_not_valid()
    {
        $other = $this->createCondition('Other 5', 'other', '5', 'price', 'price > 200');

        $item = $this->cart->add(
            $this->createItem('Foobar', 125, 3, $other, [3, 3])
        );

        $this->assertSame($item->subtotal(), 393.00);
        $this->assertSame($item->total(), 393.00);
    }

    /** @test */
    public function cart_handles_condition_rules_if_valid()
    {
        $tax = $this->createCondition('Tax 10%', 'tax', '10%');
        $other = $this->createCondition('Other 5', 'other', '5', 'price', 'price > 200');

        $items = $this->cart->add([
            $this->createItem('Foobar 1', 244, 3, [$tax, $other], [3, 3]),
            $this->createItem('Foobar 2', 125, 3, $other, [3, 3]),
        ]);

        $this->assertSame($items[0]->subtotal(), 750.00);
        $this->assertSame($items[0]->total(), 841.50);

        $this->assertSame($items[1]->subtotal(), 393.00);
        $this->assertSame($items[1]->total(), 393.00);

        $this->assertSame($this->cart->subtotal(), 1234.50);
        $this->assertSame($this->cart->total(), 1234.50);
    }

    /** @test */
    public function cart_handles_condition_rules_on_subtotal()
    {
        $condition = $this->createCondition('Subtotal', 'other', '-5', 'subtotal', 'subtotal > 50');

        $item = $this->createItem('Foobar 1', 20, 3, [$condition]);

        $item = $this->cart->add($item);

        $this->assertSame($item->subtotal(), 60.00);
        $this->assertSame($item->total(), 55.00);

        $this->assertSame($this->cart->subtotal(), 55.00);
        $this->assertSame($this->cart->total(), 55.00);
    }

    /** @test */
    public function cart_applies_multiple_conditions_on_items_and_cart()
    {
        $discount1 = $this->createCondition('Discount 5%', 'discount', '-5%');
        $discount2 = $this->createCondition('Discount 10%', 'discount', '-10%');
        $other = $this->createCondition('Other 5', 'other', '5', 'price', 'price > 200');

        $items = $this->cart->add([
            $this->createItem('Foobar 1', 244, 3, [$discount1, $other], [3, 3]),
            $this->createItem('Foobar 2', 125, 3, $other, [3, 3]),
        ]);

        $this->assertSame($items[0]->subtotal(), 750.00);
        $this->assertSame($items[0]->conditionsTotalSum('discount'), -38.25);
        $this->assertSame($items[0]->total(), 726.75);

        $this->assertSame($items[1]->subtotal(), 393.00);
        $this->assertSame($items[1]->conditionsTotalSum('other'), 0.00);
        $this->assertSame($items[1]->total(), 393.00);

        $this->assertSame($this->cart->subtotal(), 1119.75);
        $this->assertSame($this->cart->itemsSubtotal(), 1143.00);
        $this->assertSame($this->cart->total(), 1119.75);

        $this->cart->condition($discount2);

        $this->assertSame($this->cart->subtotal(), 1119.75);
        $this->assertSame($this->cart->total(), 1007.775);
        $this->assertSame($this->cart->conditionsTotalSum('discount', false), -111.975);
        $this->assertSame($this->cart->conditionsTotalSum('discount'), -150.225);
    }

    /** @test */
    public function cart_removes_conditions_from_items()
    {
        $tax = $this->createCondition('Tax 10%', 'tax', '10%');
        $other = $this->createCondition('Other 5', 'other', '5', 'price');

        $items = $this->cart->add([
            $this->createItem('Foobar 1', 244, 3, [$tax, $other], [3, 3]),
            $this->createItem('Foobar 2', 125, 3, $other, [3, 3]),
        ]);

        $this->assertSame($items[0]->total(), 841.50);
        $this->assertSame($items[1]->total(), 408.00);

        $this->cart->update([
            $items[0]['rowId'] => [
                'conditions' => $tax,
            ],
        ]);

        $this->assertSame($items[0]->total(), 825.00);

        $this->cart->update([
            $items[1]['rowId'] => [
                'conditions' => null,
            ],
        ]);

        $this->assertSame($items[1]->total(), 393.00);

        $this->cart->update([
            $items[1]['rowId'] => [
                'conditions' => [$tax, $other],
            ],
        ]);

        $this->assertSame($items[1]->total(), 448.80);

        $this->cart->update([
            $items[1]['rowId'] => [
                'weights' => 20.00,
            ],
        ]);

        $this->assertSame($items[1]->total(), 448.80);
    }

    /** @test */
    public function cart_removes_conditions_from_cart()
    {
        $tax = $this->createCondition('Tax 10%', 'tax', '10%');
        $other = $this->createCondition('Other 10%', 'other', '10%');

        $this->cart->add([
            $this->createItem('Foobar 1', 244, 3, $tax, [3, 3]),
            $this->createItem('Foobar 2', 125, 3, null, [3, 3]),
        ]);

        $this->cart->condition($tax);

        $this->assertSame($this->cart->total(), 1339.80);

        $this->cart->condition([$tax, $other]);

        $this->assertSame($this->cart->total(), 1473.78);

        $this->cart->removeConditionByType('tax', false);

        $this->assertSame($this->cart->total(), 1339.80);

        $this->cart->removeConditions(null, false);

        $this->assertSame($this->cart->total(), 1218.00);
    }

    /** @test */
    public function cart_adds_removes_conditions_from_items_and_cart()
    {
        $tax1 = $this->createCondition('Tax 10%', 'tax', '10%');
        $tax2 = $this->createCondition('Item Tax 5%', 'tax', '5%', 'price');
        $tax3 = $this->createCondition('Item Tax 10%', 'tax', '10%', 'price');

        $item = $this->cart->add(
            $this->createItem('Foobar 1', 100, 3, [$tax2, $tax3])
        );

        $this->assertSame($item->total(), 345.00);

        $this->assertSame($this->cart->total(), 345.00);
        $this->assertSame($this->cart->subtotal(), 345.00);

        $this->cart->condition($tax1);

        $this->assertSame($this->cart->subtotal(), 345.00);
        $this->assertSame($this->cart->total(), 379.50);
        $this->assertSame($this->cart->conditionsTotalSum('tax'), 79.50);

        $this->cart->removeConditionByName('Tax 10%');

        $this->assertSame($this->cart->subtotal(), 345.00);
        $this->assertSame($this->cart->total(), 345.00);
        $this->assertSame($this->cart->conditionsTotalSum('tax'), 45.00);

        $this->cart->removeConditionByType('tax');

        $this->assertSame($this->cart->subtotal(), 300.00);
        $this->assertSame($this->cart->total(), 300.00);
        $this->assertSame($this->cart->conditionsTotalSum('tax'), 0);

        $this->cart->removeConditions();

        $this->assertSame($this->cart->subtotal(), 300.00);
        $this->assertSame($this->cart->total(), 300.00);
        $this->assertSame($this->cart->conditionsTotalSum('tax'), 0);

        $this->cart->update('3544c874792b3af994b612b6c1fd2523', [
            'quantity' => 3,
        ]);

        $this->assertSame($this->cart->subtotal(), 300.00);
        $this->assertSame($this->cart->total(), 300.00);
        $this->assertSame($this->cart->conditionsTotalSum('tax'), 0);
    }

    /** @test */
    public function cart_calculates_discounts()
    {
        $discount = $this->createCondition('Discount 10%', 'discount', '-10%');

        $this->cart->add([
            $this->createItem('Foobar 1', 244, 3, $discount, [3, 3]),
            $this->createItem('Foobar 2', 125, 3, $discount, [3, 3]),
        ]);

        $this->cart->condition($discount);

        $discounts = $this->cart->conditions('discount', false);

        $discountCondition = $discounts[0];

        $this->assertSame($discountCondition->get('name'), 'Discount 10%');
        $this->assertSame($discountCondition->get('type'), 'discount');
        $this->assertSame($discountCondition->get('target'), 'subtotal');
    }

    /** @test */
    public function cart_calculates_taxes()
    {
        $tax = $this->createCondition('Tax 10%', 'tax', '10%');

        $this->cart->add([
            $this->createItem('Foobar 1', 244, 3, $tax, [3, 3]),
            $this->createItem('Foobar 2', 125, 3, $tax, [3, 3]),
        ]);

        $this->cart->condition($tax);

        $taxes = $this->cart->conditions('tax', false);

        $taxCondition = $taxes[0];

        $this->assertSame($taxCondition->get('name'), 'Tax 10%');
        $this->assertSame($taxCondition->get('type'), 'tax');
        $this->assertSame($taxCondition->get('target'), 'subtotal');
    }

    /** @test */
    public function cart_removes_conditions_with_different_targets_from_cart()
    {
        $tax = $this->createCondition('Tax 10%', 'tax', '10%');
        $other = $this->createCondition('Other 10%', 'other', '10%');

        $tax->put('code', 'foo');

        $this->cart->add([
            $this->createItem('Foobar 1', 244, 3, $tax, [3, 3]),
            $this->createItem('Foobar 2', 125, 3, null, [3, 3]),
        ]);

        $this->cart->condition($tax);

        $this->assertSame($this->cart->total(), 1339.80);

        $this->cart->condition([$tax, $other]);

        $this->assertSame($this->cart->total(), 1473.78);

        $this->cart->removeConditions('foo', false, 'code');

        $this->assertSame($this->cart->total(), 1339.80);

        $this->cart->removeConditions(null, false);

        $this->assertSame($this->cart->total(), 1218.00);
    }

    /** @test */
    public function cart_calculates_conditions_total()
    {
        $tax1 = $this->createCondition('Tax 5%', 'tax', '5%');
        $tax2 = $this->createCondition('Tax 10%', 'tax', '10%');

        $this->cart->add([
            $this->createItem('Foobar 1', 244, 3, $tax2, [3, 3]),
            $this->createItem('Foobar 2', 125, 3, $tax2, [3, 3]),
        ]);

        $this->cart->condition([$tax1, $tax2]);

        $conditionsTotal = [
            'Tax 5%'  => 62.86500000000001,
            'Tax 10%' => 125.73000000000002,
        ];

        $conditionResults = [
            'Tax 10%' => 114.30000000000001,
        ];

        $this->assertSame($this->cart->itemsConditionsTotal('tax'), $conditionResults);
        $this->assertSame($this->cart->conditionsTotal('tax', false), $conditionsTotal);
    }

    /** @test */
    public function cart_calculates_conditions_separate()
    {
        $tax1 = $this->createCondition('Tax 5%', 'tax', '5%');
        $tax2 = $this->createCondition('Tax 10%', 'tax', '10%');

        $items = $this->cart->add([
            $this->createItem('Foobar 1', 244, 3, $tax2, [3, 3]),
            $this->createItem('Foobar 2', 125, 3, $tax2, [3, 3]),
        ]);

        $this->cart->condition([$tax1, $tax2]);

        $conditionsTotal = [
            'Tax 5%'  => 62.865,
            'Tax 10%' => 125.73,
        ];

        $conditions = $items[0]->conditions();
        $condition = head($conditions);

        $this->assertSame($condition->get('name'), 'Tax 10%');
        $this->assertSame($condition->get('type'), 'tax');
        $this->assertSame($condition->get('target'), 'subtotal');

        $conditions = $this->cart->conditions(null, false);
        $condition = head($conditions);

        $this->assertSame($condition->get('name'), 'Tax 5%');
        $this->assertSame($condition->get('type'), 'tax');
        $this->assertSame($condition->get('target'), 'subtotal');
    }

    /** @test */
    public function cart_retrieves_conditions_by_name()
    {
        $tax1 = $this->createCondition('Tax 5%', 'tax', '5%');
        $tax2 = $this->createCondition('Tax 10%', 'tax', '10%');
        $other = $this->createCondition('Other 10%', 'other', '10%');
        $shipping = $this->createCondition('Shipping', 'shipping', '10');

        $items = $this->cart->add([
            $this->createItem('Foobar 1', 244, 3, $tax2, [3, 3]),
            $this->createItem('Foobar 2', 125, 3, $tax2, [3, 3]),
        ]);

        $this->assertSame($items[0]->total(), 825.00);
        $this->assertSame($items[1]->total(), 432.30);

        $this->assertSame($this->cart->total(), 1257.30);
        $this->assertSame($this->cart->subtotal(), 1257.30);

        $this->cart->setConditionsOrder([
            'discount',
            'tax',
        ]);

        $this->cart->condition([$tax2, $tax1, $shipping]);

        $this->assertSame($this->cart->total(), 1445.895);

        $conditionsOrder = [
            'discount',
            'tax',
        ];

        $this->assertSame($this->cart->getConditionsOrder(), $conditionsOrder);

        $this->cart->setConditionsOrder([
            'discount',
            'tax',
            'shipping',
        ]);

        $this->cart->condition([$tax2, $tax1, $shipping]);

        $this->assertSame($this->cart->total(), 1455.895);

        $conditionResults = [
            'tax' => [
                'Tax 10%' => 240.03000000000003,
                'Tax 5%'  => 62.86500000000001,
            ],
            'shipping' => [
                'Shipping' => 10.00,
            ],
        ];

        $this->assertSame($this->cart->conditionsTotal(), $conditionResults);

        $this->cart->setConditionsOrder([
            'discount',
            'other',
            'tax',
            'shipping',
        ]);

        $this->cart->condition([$tax2, $tax1, $shipping, $other]);

        $this->assertSame($this->cart->total(), 1600.4845);

        $conditionResults = [
            'tax' => [
                'Tax 10%' => 252.60300000000012,
                'Tax 5%'  => 69.15149999999994,
            ],
            'other' => [
                'Other 10%' => 125.73000000000002,
            ],
            'shipping' => [
                'Shipping' => 10.00,
            ],
        ];

        $this->assertSame($this->cart->conditionsTotal(), $conditionResults);

        $conditionResults = [
            'other' => [
                'Other 10%' => 125.73000000000002,
            ],
            'tax' => [
                'Tax 10%' => 138.3030000000001,
                'Tax 5%'  => 69.15149999999994,
            ],
            'shipping' => [
                'Shipping' => 10.00,
            ],
        ];

        $this->assertSame($this->cart->conditionsTotal(null, false), $conditionResults);

        $conditionResults = [
            'Tax 10%' => 252.60300000000012,
            'Tax 5%'  => 69.15149999999994,
        ];

        $this->assertSame($this->cart->conditionsTotal('tax'), $conditionResults);

        $conditionResults = [
            'tax' => [
                'Tax 10%' => 114.30000000000001,
            ],
        ];

        $this->assertSame($this->cart->itemsConditionsTotal(), $conditionResults);

        $conditionResults = [
            'Tax 10%' => 114.30000000000001,
        ];

        $this->assertSame($this->cart->itemsConditionsTotal('tax'), $conditionResults);
        $this->assertSame($this->cart->itemsConditionsTotal('nonexisting'), []);
    }

    /** @test */
    public function cart_handles_inclusive_conditions_alone()
    {
        $tax = $this->createCondition('Tax 10%', 'tax', '10%', 'subtotal', null, true);

        $items = $this->cart->add([
            $this->createItem('Foobar 1', 100, 5, $tax),
            $this->createItem('Foobar 2', 200, 2, $tax),
        ]);

        $this->assertSame($items[0]->subtotal(), 500.00);
        $this->assertSame($items[0]->total(), 500.00);
        $this->assertSame(round($items[0]->conditionsTotalSum('tax')), 45.00);

        $this->assertSame($items[1]->subtotal(), 400.00);
        $this->assertSame($items[1]->total(), 400.00);
        $this->assertSame(round($items[1]->conditionsTotalSum('tax')), 36.00);

        $this->assertSame($this->cart->subtotal(), 900.00);
        $this->assertSame($this->cart->total(), 900.00);

        $this->cart->condition($tax);

        $this->assertSame($this->cart->total(), 900.00);
        $this->assertSame(round($this->cart->conditionsTotalSum('tax', false)), 82.00);
        $this->assertSame(round($this->cart->conditionsTotalSum('tax')), 164.00);
    }

    /** @test */
    public function cart_handles_inclusive_conditions_with_other_conditions()
    {
        $taxInc = $this->createCondition('Tax 10% Inc', 'tax', '10%', 'subtotal', null, true);
        $taxExc = $this->createCondition('Tax 10% Exc', 'tax', '10%');

        $items = $this->cart->add([
            $this->createItem('Foobar 1', 100, 5, [$taxInc, $taxExc]),
            $this->createItem('Foobar 2', 200, 2, [$taxInc, $taxExc]),
        ]);

        $this->assertSame($items[0]->subtotal(), 500.00);
        $this->assertSame($items[0]->total(), 550.00);
        $this->assertSame(round($items[0]->conditionsTotalSum('tax')), 95.00);

        $this->assertSame($items[1]->subtotal(), 400.00);
        $this->assertSame($items[1]->total(), 440.00);
        $this->assertSame(round($items[1]->conditionsTotalSum('tax')), 76.00);

        $this->assertSame($this->cart->subtotal(), 990.00);
        $this->assertSame($this->cart->total(), 990.00);

        $this->cart->condition($taxInc);

        $this->assertSame($this->cart->total(), 990.00);
        $this->assertSame(round($this->cart->conditionsTotalSum('tax', false)), 90.00);
        $this->assertSame(round($this->cart->conditionsTotalSum('tax')), 262.00);
    }

    /** @test */
    public function cart_calculates_total_till_condition_type()
    {
        $discount = $this->createCondition('Discount 5%', 'discount', '-5.00%');
        $other = $this->createCondition('Other 5', 'other', 5);
        $tax = $this->createCondition('Tax 10%', 'tax', '10%');
        $shipping = $this->createCondition('Shipping', 'shipping', '10');

        $this->cart->setItemsConditionsOrder([
            'discount',
            'other',
            'tax',
            'shipping',
        ]);

        $item = $this->createItem('Foobar 1', 100, 5, [$discount, $shipping, $other, $tax]);

        $item = $this->cart->add($item);

        $this->assertSame($item->total('discount'), 475.00);
        $this->assertSame($item->total('other'), 480.00);
        $this->assertSame($item->total('tax'), 528.00);
        $this->assertSame($item->total('shipping'), 538.00);
    }

    /** @test */
    public function cart_calculates_total_till_condition_type_per_item()
    {
        $discount = $this->createCondition('Discount 5%', 'discount', '-5.00%');
        $other = $this->createCondition('Other 5', 'other', 5);
        $tax = $this->createCondition('Tax 10%', 'tax', '10%');
        $shipping = $this->createCondition('Shipping', 'shipping', '10');

        $this->cart->setItemsConditionsOrder([
            'discount',
            'other',
            'tax',
            'shipping',
        ]);

        $this->cart->setConditionsOrder([
            'discount',
            'other',
            'tax',
            'shipping',
        ]);

        $item1 = $this->createItem('Foobar 1', 100, 5, [$discount, $shipping, $other, $tax]);
        $item2 = $this->createItem('Foobar 2', 100, 5, [$discount, $shipping, $other, $tax]);

        $items = $this->cart->add([$item1, $item2]);

        $item1 = $items[0];
        $item2 = $items[1];

        $item1->setConditionsOrder([
            'discount',
        ]);

        $this->assertSame($item1->total('discount'), 475.00);
        $this->assertSame($item1->total('other'), 475.00);
        $this->assertSame($item1->total('tax'), 475.00);
        $this->assertSame($item1->total('shipping'), 475.00);

        $this->assertSame($item2->total('discount'), 475.00);
        $this->assertSame($item2->total('other'), 480.00);
        $this->assertSame($item2->total('tax'), 528.00);
        $this->assertSame($item2->total('shipping'), 538.00);

        $this->cart->condition([$discount, $shipping, $other, $tax]);

        $this->assertSame($this->cart->total('discount'), 962.35);
        $this->assertSame($this->cart->total('other'), 967.35);
        $this->assertSame($this->cart->total('tax'), 1064.085);
        $this->assertSame($this->cart->total('shipping'), 1074.085);
    }

    /** @test */
    public function cart_can_handle_zeroed_out_subtotals()
    {
        $discount = $this->createCondition('Discount 100%', 'discount', '-100.00%');
        $tax = $this->createCondition('Tax 10%', 'tax', '10%');

        $item = $this->cart->add(
            $this->createItem('Foobar 1', 100, 5, [$discount, $tax])
        );

        $this->assertSame($item->total('discount'), 0.00);
        $this->assertSame($item->subtotal(), 500.00);
        $this->assertSame($item->conditionsTotalSum('discount'), -500.00);
        $this->assertSame($item->conditionsTotalSum('tax'), 0);
        $this->assertSame($item->total(), 0.00);

        $this->assertCount(2, $item->conditions());
        $this->assertCount(1, $item->conditions('discount'));
        $this->assertCount(1, $item->conditions('tax'));
        $this->assertCount(2, $this->cart->itemsConditions());

        $this->assertSame($this->cart->itemsConditionsTotalSum('discount'), -500.00);
        $this->assertSame($this->cart->itemsConditionsTotalSum('tax'), 0);
        $this->assertSame($this->cart->itemsSubtotal(), 500.00);
        $this->assertSame($this->cart->subtotal(), 0.00);
        $this->assertSame($this->cart->total(), 0.00);

        $item->removeConditions('tax');

        $this->assertSame($item->total(), 0.00);

        $item->removeConditions();

        $this->assertSame($item->total(), 500.00);
    }

    /** @test */
    public function cart_can_handle_100_percent_price_based_item_conditions()
    {
        $discount = $this->createCondition('Discount 100%', 'discount', '-100.00%', 'price');

        $item = $this->cart->add(
            $this->createItem('Foobar 1', 100, 1, [$discount])
        );

        $this->assertSame($item->total(), 0.00);
        $this->assertSame($item->subtotal(), 100.00);

        $this->assertSame($this->cart->total(), 0.00);
        $this->assertSame($this->cart->subtotal(), 0.00);

        $item->removeConditions();

        $this->assertSame($item->total(), 100.00);
    }
}
