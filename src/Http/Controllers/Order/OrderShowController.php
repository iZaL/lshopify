<?php

namespace IZal\Lshopify\Http\Controllers\Order;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Managers\WorkflowManager;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Resources\OrderResource;
use Inertia\Inertia;
use IZal\Lshopify\Resources\VariantResource;
use IZal\Lshopify\Resources\WorkflowVariantResource;

class OrderShowController extends Controller
{
    public function __invoke($id): \Inertia\Response
    {
        $order = Order::find($id);
        $orderResource = new OrderResource($order);

        $unfulfilledVariants = (new WorkflowManager($order))->getUnfulfilledVariants()->map(function ($variant) {
            $v = Variant::with(['product'])->find($variant->id)
                ->setAttribute('pivot',$variant->pivot);
            return $v;
        });

        $pendingFulfillments = WorkflowVariantResource::collection($unfulfilledVariants);

        return Inertia::render('Order/OrderView', ['order' => $orderResource,'pending_fulfillments' => $pendingFulfillments]);
    }
}
