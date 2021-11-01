<?php

namespace IZal\Lshopify\Http\Controllers\Order\Transaction;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\PaymentStoreRequest;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Resources\OrderResource;
use Inertia\Inertia;

class RefundShowController extends Controller
{
    public function __invoke($orderID, PaymentStoreRequest $request)
    {
        $order = Order::with(['fulfillments.variants.product'])->find($orderID);
        $orderResource = new OrderResource($order);
        return Inertia::render('Order/Refund', ['order' => $orderResource]);
    }
}
