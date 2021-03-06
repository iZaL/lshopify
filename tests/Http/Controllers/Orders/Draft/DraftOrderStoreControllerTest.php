<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Orders\Draft;

use IZal\Lshopify\Cart\Condition;
use IZal\Lshopify\Models\Discount;
use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Tests\Cart\CartTestCase;

class DraftOrderStoreControllerTest extends CartTestCase
{
    public function test_can_store_draft_order()
    {
        $product = Product::factory()
            ->hasVariants(2, function (array $attributes, Product $product) {
                return ['product_id' => $product->id];
            })
            ->create();

        $variant = Variant::all()->last();

        $item = [
            'id' => $variant->id,
            'name' => 'MX / A / H',
            'quantity' => 2,
            'price' => 200,
            'unit_price' => 180,
            'subtotal' => 400,
            'total' => 360,
        ];

        $cartDiscount = [
            'suffix' => 'amount',
            'value' => '10',
            'reason' => 'VVIP customer',
            'name' => 'cart',
            'type' => 'discount',
            'target' => 'subtotal',
        ];

        $cartDiscountDBData = [
            'value_type' => 'amount',
            'value' => '10',
            'reason' => 'VVIP customer',
            'auto' => 1,
            'target_type' => 'all_products',
            'name' => 'Admin cart discount',
        ];

        $cartItem = $this->cart->add($item);
        $cartCondition = new Condition($cartDiscount);
        $cartCondition->setActions([['value' => '-10']]);
        $this->cart->condition($cartCondition);

        $itemDiscount = [
            'suffix' => 'percent',
            'value' => '10',
            'reason' => 'VIP customer',
            'name' => $variant->id,
            'type' => 'discount',
            'target' => 'subtotal',
        ];

        $itemDiscountDBData = [
            'value_type' => 'percent',
            'value' => '10',
            'reason' => 'VIP customer',
            'name' => 'Admin discount',
            'auto' => '1',
            'target_type' => 'all_products',
        ];
        $itemCondition = new Condition($itemDiscount);
        $itemCondition->setActions([['value' => '-10%']]);
        $this->cart->update($cartItem->rowId, ['conditions' => $itemCondition]);

        $req = $this->post(route('lshopify.draft.orders.store'));

        $order = DraftOrder::with(['variants'])->get()->last();
        $cartDiscount = Discount::all()->first();
        $itemDiscount = Discount::all()->last();

        $variant = Variant::all()->last();
        $this->assertDatabaseHas('orders', ['id' => $order->id, 'draft'=> 1, 'total' => 350, 'subtotal' => 360, 'quantity' => 2, 'discount_id' => $cartDiscount->id]);
        $this->assertDatabaseHas('discounts', array_merge($cartDiscountDBData, ['name' => 'Admin cart discount']));
        $this->assertDatabaseHas('discounts', array_merge($itemDiscountDBData, ['name' => 'Admin discount']));
        $this->assertDatabaseHas('discountables',['discount_id' => $itemDiscount->id, 'discountable_id' => $variant->id, 'discountable_type' => 'variant']);
    }
}
