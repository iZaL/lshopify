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
        $order = Order::with(['workflows.variants.product'])->find($id);
        $orderResource = new OrderResource($order);

        $unfulfilledVariants = (new WorkflowManager($order))->getUnfulfilledVariantsWithPivot();
        $totalUnfulfilledVariantsCount = $unfulfilledVariants->sum('pivot.quantity');
        $pendingFulfillments = WorkflowVariantResource::collection($unfulfilledVariants)->additional(
            [
                'unfulfilled_variants_count' => $totalUnfulfilledVariantsCount,
            ]
        );

        return Inertia::render('Order/OrderView', ['order' => $orderResource,'pending_fulfillments' => $pendingFulfillments]);
    }
}
