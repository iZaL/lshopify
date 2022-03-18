<?php

namespace IZal\Lshopify\Http\Controllers\Order;

use Inertia\Inertia;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\PaymentStoreRequest;
use IZal\Lshopify\Http\Requests\RefundRequest;
use IZal\Lshopify\Managers\WorkflowManager;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\Workflow;
use IZal\Lshopify\Resources\OrderResource;
use IZal\Lshopify\Resources\WorkflowVariantResource;

class RefundController extends Controller
{
    public function index($orderID, PaymentStoreRequest $request)
    {
        $order = Order::find($orderID);
        $orderResource = new OrderResource($order);

        $unfulfilledVariants = (new WorkflowManager($order))->getUnfulfilledVariantsWithPivot();
        $unfulfilledVariants = WorkflowVariantResource::collection($unfulfilledVariants);

        $fulfilledVariants = (new WorkflowManager($order))->getFulfilledVariantsWithPivot();
        $fulfilledVariants = WorkflowVariantResource::collection($fulfilledVariants);

        return Inertia::render('Order/Refund', [
            'order' => $orderResource,
            'pending_fulfillments' => $unfulfilledVariants,
            'fulfillments' => $fulfilledVariants,
        ]);
    }

    public function store($orderID, RefundRequest $request)
    {
        $order = Order::with(['variants', 'workflows.variants'])->find($orderID);

        $pendingFulfillments = collect($request->pending_fulfillments)->reject(function ($fulfillment) {
            return $fulfillment['pivot_quantity'] == 0;
        });
        if ($pendingFulfillments->count() > 0) {
            (new WorkflowManager($order))->createRemovedWorkflow($pendingFulfillments);
        }

        $fulfillments = collect($request->fulfillments)->reject(function ($fulfillment) {
            return $fulfillment['pivot_quantity'] == 0;
        });
        if ($fulfillments->count() > 0) {
            (new WorkflowManager($order))->createRefundWorkflow($fulfillments);
        }

        return redirect()
            ->route('lshopify.orders.show', $order->id)
            ->with('success', 'Saved');
    }
}
