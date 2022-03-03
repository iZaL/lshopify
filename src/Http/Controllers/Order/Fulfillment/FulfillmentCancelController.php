<?php

namespace IZal\Lshopify\Http\Controllers\Order\Fulfillment;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\OrderFulfillmentFulfillRequest;
use IZal\Lshopify\Managers\WorkflowManager;
use IZal\Lshopify\Models\Order;

class FulfillmentCancelController extends Controller
{
    public function __invoke($orderID, $fulfillmentID)
    {
        $order = Order::find($orderID);

        $fulfillment = $order->fulfillments->firstWhere('id', $fulfillmentID);

        $workflowManager = (new WorkflowManager($order))->cancelFulfillment($fulfillment);

        return redirect()->route('lshopify.orders.show', $order->id)->with('success', 'Fulfillment Cancelled');
    }
}
