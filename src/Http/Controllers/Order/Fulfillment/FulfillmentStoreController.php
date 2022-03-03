<?php

namespace IZal\Lshopify\Http\Controllers\Order\Fulfillment;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\OrderFulfillmentFulfillRequest;
use IZal\Lshopify\Managers\WorkflowManager;
use IZal\Lshopify\Models\Order;

class FulfillmentStoreController extends Controller
{
    public function __invoke($orderID, OrderFulfillmentFulfillRequest $request)
    {
        $order = Order::find($orderID);

        $workflowManager = (new WorkflowManager($order))->createFulfillmentWorkflow($request->variants);

        return redirect()->route('lshopify.orders.show', $order->id)->with('success', 'Saved');
    }
}
