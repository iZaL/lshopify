<?php

namespace IZal\Lshopify\Http\Controllers\Order\Transaction;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\RefundRequest;
use IZal\Lshopify\Managers\WorkflowManager;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\Workflow;

class RefundController extends Controller
{

    public function __invoke($orderID, RefundRequest $request)
    {
        $order = Order::with(['variants','workflows.variants'])->find($orderID);

        $pendingFulfillments = collect($request->pending_fulfillments)->reject(function ($fulfillment) {
            return $fulfillment['pivot_quantity'] == 0;
        });

        (new WorkflowManager($order))->createPendingFulfillments($pendingFulfillments);

        $fulfillments = collect($request->fulfillments)->reject(function ($fulfillment) {
            return $fulfillment['pivot_quantity'] == 0;
        });

        (new WorkflowManager($order))->createFulfillments($fulfillments);

        return redirect()->route('lshopify.orders.show', $order->id)->with('success', 'Saved');
    }
}












