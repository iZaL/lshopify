<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Orders\Draft;

use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\CustomerAddress;
use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Variant;
use Illuminate\Support\Arr;
use IZal\Lshopify\Tests\Cart\CartTestCase;

class DraftOrderUpdateControllerTest extends CartTestCase
{
    public function test_can_update_draft_order()
    {
        $customer = Customer::factory()->has(CustomerAddress::factory()->count(1)->default(), 'addresses')->create();

        $order = DraftOrder::factory()->create([
            'customer_id' => $customer->id,
        ]);

        $data = [
            'customer_id' => $customer->id,
        ];

        Product::factory()->has(Variant::factory()->count(3))->create();

        $variant1 = Variant::first();
        $variant2 = Variant::all()->last();
        $removedVariant = Variant::whereNotIn('id',[$variant1->id,$variant2->id])->first();

        $item = [
            'id' => $variant1->id,
            'name' => $variant1->id,
            'quantity' => 1,
            'price' => 100,
            'unit_price' => 100,
            'subtotal' => 100,
            'total' => 100,
        ];

        $addedItem = [
            'id' => $variant2->id,
            'name' => $variant1->id,
            'quantity' => 2,
            'price' => 200,
            'unit_price' => 200,
            'subtotal' => 400,
            'total' => 400,
        ];

        $removedItem = [
            'id' => $removedVariant->id,
            'name' => $removedVariant->id,
            'quantity' => 1,
            'price' => 100,
            'unit_price' => 100,
            'subtotal' => 100,
            'total' => 100,
        ];

        $this->cart->add($item);

        $order->variants()->attach($variant1->id, Arr::except($item, ['name']));
        $order->variants()->attach($removedVariant->id, Arr::except($removedItem, ['name']));

        $order->update(['total' => $this->cart->total(), 'subtotal' => $this->cart->subtotal(), 'quantity' => $this->cart->quantity()]);

        $this->cart->add($addedItem);

        $this->patch(route('lshopify.draft.orders.update', $order->id), $data);

        $this->assertEquals(500, $this->cart->total());

        $this->assertDatabaseHas('orders', [
            'customer_id' => $customer->id,
            'draft' => 1,
        ]);

        $this->assertDatabaseHas('order_variants', ['variant_id' => $variant1->id, 'quantity' => 1]);
        $this->assertDatabaseHas('order_variants', ['variant_id' => $variant2->id, 'quantity' => 2]);
        $this->assertDatabaseMissing('order_variants', ['variant_id' => $removedVariant->id, 'quantity' => 1]);
        $this->assertDatabaseHas('orders', ['total' => 500, 'subtotal' => 500, 'quantity' => 3, 'draft' => 1]);
    }

    public function test_can_update_draft_order_shipping_and_billing_details()
    {
        $customer = Customer::factory()->has(CustomerAddress::factory()->count(1)->default(), 'addresses')->create();

        $oldShippingAddress = ['company' => 'ABC', 'phone' => '99999999'];
        $oldBillingAddress = ['company' => 'ABCD', 'phone' => '88888888'];

        $order = DraftOrder::factory()->create([
            'customer_id' => $customer->id,
            'shipping_company' => $oldShippingAddress['company'],
            'shipping_phone' => $oldShippingAddress['phone'],
            'billing_company' => $oldBillingAddress['company'],
            'billing_phone' => $oldBillingAddress['phone'],
        ]);

        $newShippingAddress = ['company' => 'UF', 'phone' => '77777777'];
        $newBillingAddress = ['company' => 'UFF', 'phone' => '66666666'];

        $data = [
            'customer_id' => $customer->id,
            'shipping' => $newShippingAddress,
            'billing' => $newBillingAddress,
        ];

        $this->patch(route('lshopify.draft.orders.update', $order->id), $data);

        $this->assertDatabaseHas('orders', [
            'customer_id' => $customer->id,
            'shipping_company' => $newShippingAddress['company'],
            'shipping_phone' => $newShippingAddress['phone'],
            'billing_company' => $newBillingAddress['company'],
            'billing_phone' => $newBillingAddress['phone'],
            'draft' => 1,
        ]);
    }

    public function test_can_attach_customer_to_draft_order()
    {
        $customer = Customer::factory()->has(CustomerAddress::factory()->count(1)->default(), 'addresses')->create();
        $order = DraftOrder::factory()->create();

        $address = $customer->default_address;

        $this->post(route('lshopify.draft.orders.customer.update', $order->id), ['customer_id' => $customer->id]);
        $this->assertDatabaseHas('orders', [
            'customer_id' => $customer->id,
            'shipping_company' => $address->company,
            'shipping_address1' => $address->address1,
            'shipping_address2' => $address->address2,
            'shipping_phone' => $address->phone,
            'billing_company' => $address->company,
            'billing_address1' => $address->address1,
            'billing_address2' => $address->address2,
            'billing_phone' => $address->phone,
            'draft' => 1,
        ]);
    }

    public function test_can_remove_customer_from_draft_order()
    {
        $customer = Customer::factory()->has(CustomerAddress::factory()->count(1)->default(), 'addresses')->create();
        $order = DraftOrder::factory()->create(['customer_id' => $customer->id]);
        $this->post(route('lshopify.draft.orders.customer.update', $order->id), ['customer_id' => null]);
        $this->assertDatabaseHas('orders', ['customer_id' => null, 'draft' => 1]);
    }
}
