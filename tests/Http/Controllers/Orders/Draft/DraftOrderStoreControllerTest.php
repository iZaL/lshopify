<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Orders\Draft;

use IZal\Lshopify\Cart\Condition;
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

        $itemDiscount = [
            'suffix' => 'percentage',
            'value' => '10',
            'reason' => 'VIP customer',
            'name' => $variant->id,
            'type' => 'discount',
            'target' => 'subtotal',
        ];

        $cartItem = $this->cart->add($item);

        $cartCondition = new Condition($cartDiscount);
        $cartCondition->setActions([['value' => '-10']]);
        $this->cart->condition($cartCondition);

        $itemCondition = new Condition($itemDiscount);
        $itemCondition->setActions([['value' => '-10%']]);
        $this->cart->update($cartItem->rowId, ['conditions' => $itemCondition]);

        $req = $this->post(route('lshopify.draft.orders.store'));

        $order = DraftOrder::with(['variants'])->get()->last();

        $this->assertDatabaseHas('orders', ['id' => $order->id, 'draft'=> 1, 'total' => 350, 'subtotal' => 360, 'quantity' => 2]);
        $this->assertDatabaseHas('order_variants', ['variant_id' => $variant->id, 'order_id' => $order->id, 'price' => $item['price'], 'quantity' => $item['quantity'], 'total' => $item['total'], 'subtotal' => $item['subtotal'], 'unit_price' => $item['unit_price']]);
        $this->assertDatabaseHas('discounts', array_merge($itemDiscount, ['order_id' => $order->id, 'variant_id' => $item['id'], 'name' => $item['id']]));
        $this->assertDatabaseHas('discounts', ['order_id' => $order->id, 'name' => 'cart', 'variant_id' => null]);
    }
}
