<?php

namespace IZal\Lshopify\Tests\Http\Controllers\Order\Payment;

use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\Transaction;
use IZal\Lshopify\Tests\TestCase;

class PaymentStoreControllerTest extends TestCase
{
    public function test_can_create_payment_for_unpaid_order()
    {
        $order = Order::factory()
            ->hasTransactions(1, function (array $attributes, Order $order) {
                return ['order_id' => $order->id, 'amount' => 80, 'status' => Transaction::STATUS_SUCCESS];
            })
            ->create(['total' => 100, 'subtotal' => 100]);

        $req = $this->post(route('lshopify.orders.payments.store', $order->id));

        $this->assertDatabaseHas('transactions', ['order_id' => $order->id, 'amount' => $order->total, 'gateway' => Transaction::GATEWAY_MANUAL, 'kind' => Transaction::KIND_SALE, 'status' => Transaction::STATUS_SUCCESS]);
    }
}
