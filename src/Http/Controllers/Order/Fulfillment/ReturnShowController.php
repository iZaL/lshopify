<?php

namespace IZal\Lshopify\Http\Controllers\Order\Fulfillment;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Managers\WorkflowManager;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Resources\CustomerResource;
use IZal\Lshopify\Resources\OrderResource;
use Inertia\Inertia;
use IZal\Lshopify\Resources\WorkflowVariantResource;

class ReturnShowController extends Controller
{
    public function __invoke($orderID): \Inertia\Response
    {
        $order = Order::find($orderID);
        $orderResource = new OrderResource($order);

        $unfulfilledVariants = (new WorkflowManager($order))->getUnfulfilledVariantsWithPivot();
        $unfulfilledVariants = WorkflowVariantResource::collection($unfulfilledVariants);

        $fulfilledVariants = (new WorkflowManager($order))->getFulfilledVariantsWithPivot();
        $fulfilledVariants = WorkflowVariantResource::collection($fulfilledVariants);
        return Inertia::render(
            'Order/ReturnView',
            [
                'order' => $orderResource,
                'fulfillments' => $fulfilledVariants
            ]
        );
    }
}
