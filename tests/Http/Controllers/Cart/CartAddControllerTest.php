<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Cart;

use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Tests\Cart\CartTestCase;

class CartAddControllerTest extends CartTestCase
{
    public function test_can_add_item_to_cart()
    {
        $product = Product::factory()
            ->hasVariants(2, function (array $attributes, Product $product) {
                return ['product_id' => $product->id];
            })
            ->create();

        $variant1 = Variant::find(1);
        $variant2 = Variant::find(2);

        $req = $this->post(route('lshopify.cart.add'), ['variantIDs' => [$variant1->id, $variant2->id]]);

        $this->assertEquals(2, $this->cart->items()->count());
    }

    public function test_can_save_item_to_orders_cart()
    {
        $product = Product::factory()
            ->hasVariants(2, function (array $attributes, Product $product) {
                return ['product_id' => $product->id];
            })
            ->create();

        $variant1 = Variant::all()->last();

        $order = DraftOrder::factory()->draft()->create();

        $req = $this->post(route('lshopify.cart.add'), ['variantIDs' => [$variant1->id], 'orderID' => $order->id]);

        $this->assertEquals(1, $this->cart->items()->count());
    }
}
