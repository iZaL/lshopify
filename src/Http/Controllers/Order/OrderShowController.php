<?php

namespace IZal\Lshopify\Http\Controllers\Order;

use Inertia\Inertia;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Managers\WorkflowManager;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Resources\CustomerResource;
use IZal\Lshopify\Resources\OrderResource;
use IZal\Lshopify\Resources\WorkflowVariantResource;

class OrderShowController extends Controller
{
    public function __invoke($id): \Inertia\Response
    {
        $order = Order::with(['workflows.variants.product.image', 'workflows.variants.image', 'customer'])->find($id);
        $customers = Customer::all();

        $unfulfilledVariants = (new WorkflowManager($order))->getUnfulfilledVariantsWithPivot();
        $totalUnfulfilledVariantsCount = $unfulfilledVariants->sum('pivot.quantity');
        $pendingFulfillments = WorkflowVariantResource::collection($unfulfilledVariants)->additional([
            'unfulfilled_variants_count' => $totalUnfulfilledVariantsCount,
        ]);

        $orderResource = new OrderResource($order);

        return Inertia::render('Order/OrderView', [
            'order' => $orderResource,
            'pending_fulfillments' => $pendingFulfillments,
            'customers' => CustomerResource::collection($customers),
        ]);
    }
}
