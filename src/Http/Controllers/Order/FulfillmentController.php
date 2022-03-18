<?php

namespace IZal\Lshopify\Http\Controllers\Order;

use Inertia\Inertia;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\OrderFulfillmentFulfillRequest;
use IZal\Lshopify\Managers\WorkflowManager;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Resources\CustomerResource;
use IZal\Lshopify\Resources\OrderResource;
use IZal\Lshopify\Resources\WorkflowVariantResource;

class FulfillmentController extends Controller
{
    public function index($orderID): \Inertia\Response
    {
        $order = Order::with(['customer'])->find($orderID);
        $orderResource = new OrderResource($order);
        $customers = CustomerResource::collection(Customer::all());
        $unfulfilledVariants = (new WorkflowManager($order))->getUnfulfilledVariantsWithPivot();
        $pendingFulfillments = WorkflowVariantResource::collection($unfulfilledVariants);

        return Inertia::render('Order/FulfillmentView', [
            'pending_fulfillments' => $pendingFulfillments,
            'order' => $orderResource,
            'customers' => $customers,
        ]);
    }

    public function store($orderID, OrderFulfillmentFulfillRequest $request)
    {
        $order = Order::find($orderID);

        $workflowManager = (new WorkflowManager($order))->createFulfillmentWorkflow($request->variants);

        return redirect()
            ->route('lshopify.orders.show', $order->id)
            ->with('success', 'Saved');
    }

    public function delete($orderID, $fulfillmentID)
    {
        $order = Order::find($orderID);

        $fulfillment = $order->fulfillments->firstWhere('id', $fulfillmentID);

        $workflowManager = (new WorkflowManager($order))->cancelFulfillment($fulfillment);

        return redirect()
            ->route('lshopify.orders.show', $order->id)
            ->with('success', 'Fulfillment Cancelled');
    }
}
