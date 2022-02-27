<?php

namespace IZal\Lshopify\Http\Controllers\Order\Fulfillment;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Managers\WorkflowManager;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\Fulfillment;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Resources\CustomerResource;
use IZal\Lshopify\Resources\FulfillmentResource;
use IZal\Lshopify\Resources\OrderResource;
use Inertia\Inertia;
use IZal\Lshopify\Resources\WorkflowVariantResource;

class FulfillmentShowController extends Controller
{
    public function __invoke($orderID): \Inertia\Response
    {
//        $fulfillment = Fulfillment::with(['variants.product'])->find($fulfillmentID);
//        $fulfillmentResource = new FulfillmentResource($fulfillment);

        $order = Order::with(['customer'])->find($orderID);
        $orderResource = new OrderResource($order);

        $customers = CustomerResource::collection(Customer::all());

        $unfulfilledVariants = (new WorkflowManager($order))->getUnfulfilledVariants()->map(function ($variant) {
            $v = Variant::with(['product'])->find($variant->id)
                ->setAttribute('pivot',$variant->pivot);
            return $v;
        });

        $pendingFulfillments = WorkflowVariantResource::collection($unfulfilledVariants);

        return Inertia::render(
            'Order/FulfillmentView',
            [
                'pending_fulfillments' => $pendingFulfillments,
                'order' => $orderResource,
                'customers' => $customers,
            ]
        );
    }
}
