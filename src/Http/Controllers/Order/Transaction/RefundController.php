<?php

namespace IZal\Lshopify\Http\Controllers\Order\Transaction;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\RefundRequest;
use IZal\Lshopify\Managers\OrderManager;
use IZal\Lshopify\Models\Fulfillment;
use IZal\Lshopify\Models\FulfillmentVariant;
use IZal\Lshopify\Models\Order;

class RefundController extends Controller
{

    public function __invoke($orderID, RefundRequest $request)
    {
        $order = Order::find($orderID);

//        $fulfillments = $order->fulfillments()->pluck('id')->toArray();

        $successFulfillments = $order->success_fulfillments()->get();

        // get all order variants
        // get all order fulfillments
        // get all pending fulfillment variants where fulfillment id

        if ($order->isPaymentPending()) {
            $orderManager = new OrderManager($order);

            foreach ($request->variants as $variants) {
                $orderManager->returnItems($variants, $request->has('restock') ?? false);
            }
        }

        return redirect()->route('lshopify.orders.show', $order->id)->with('success', 'Saved');
    }
}












