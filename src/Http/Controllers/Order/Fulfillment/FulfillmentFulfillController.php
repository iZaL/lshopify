<?php

namespace IZal\Lshopify\Http\Controllers\Order\Fulfillment;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\OrderFulfillmentFulfillRequest;
use IZal\Lshopify\Managers\FulfillmentManager;
use IZal\Lshopify\Managers\OrderManager;
use IZal\Lshopify\Models\Fulfillment;
use IZal\Lshopify\Models\Order;

class FulfillmentFulfillController extends Controller
{
    public function __invoke($orderID, $fulfillmentID, OrderFulfillmentFulfillRequest $request)
    {
        $order = Order::find($orderID);

        $fulfillment = Fulfillment::with(['variants'])->find($fulfillmentID);

        $newFulfillment = Fulfillment::create(['order_id' => $orderID]);

        $fulfillmentManager = new FulfillmentManager($newFulfillment);

        foreach ($request->get('variants') as $variantAttribute) {
            $fulfillmentManager->fulfillItems($fulfillment, $variantAttribute);
        }

        return redirect()->route('lshopify.orders.show', $order->id)->with('success', 'Saved');
    }
}
