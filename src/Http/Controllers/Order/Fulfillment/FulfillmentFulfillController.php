<?php

namespace IZal\Lshopify\Http\Controllers\Order\Fulfillment;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\OrderFulfillmentFulfillRequest;
use IZal\Lshopify\Managers\FulfillmentManager;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\Workflow;

class FulfillmentFulfillController extends Controller
{
    public function __invoke($orderID, OrderFulfillmentFulfillRequest $request)
    {
        $order = Order::find($orderID);

        $fulfillment = Workflow::create(['order_id' => $orderID, 'type' => 'fulfilled']);

        $fulfillmentManager = new FulfillmentManager($fulfillment);

        foreach ($request->get('variants') as $variantAttribute) {
            $fulfillmentManager->fulfillItems($variantAttribute);
        }

        return redirect()->route('lshopify.orders.show', $order->id)->with('success', 'Saved');
    }
}
