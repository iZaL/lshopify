<?php

namespace IZal\Lshopify\Http\Controllers\Order\Transaction;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\PaymentStoreRequest;
use IZal\Lshopify\Managers\OrderManager;
use IZal\Lshopify\Models\Order;

class PaymentStoreController extends Controller
{
    public function __invoke($orderID, PaymentStoreRequest $request)
    {
        $order = Order::find($orderID);

        $orderManager = new OrderManager($order);

        $orderManager->collectManualPayment();

        return redirect()
            ->route('lshopify.orders.show', $order->id)
            ->with('success', 'Saved');
    }
}
