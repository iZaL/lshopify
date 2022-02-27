<?php

namespace IZal\Lshopify\Http\Controllers\Order\Transaction;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\PaymentStoreRequest;
use IZal\Lshopify\Managers\WorkflowManager;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Resources\OrderResource;
use Inertia\Inertia;
use IZal\Lshopify\Resources\WorkflowVariantResource;

class RefundShowController extends Controller
{
    public function __invoke($orderID, PaymentStoreRequest $request)
    {
        $order = Order::with(['fulfillments.variants.product'])->find($orderID);
        $orderResource = new OrderResource($order);

        $unfulfilledVariants = (new WorkflowManager($order))->getUnfulfilledVariantsWithPivot();
        $unfulfilledVariants = WorkflowVariantResource::collection($unfulfilledVariants);

        $fulfilledVariants = (new WorkflowManager($order))->getFulfilledVariantsWithPivot();
        $fulfilledVariants = WorkflowVariantResource::collection($fulfilledVariants);


        return Inertia::render('Order/Refund', ['order' => $orderResource,'pending_fulfillments' => $unfulfilledVariants, 'fulfillments' => $fulfilledVariants]);
    }
}
