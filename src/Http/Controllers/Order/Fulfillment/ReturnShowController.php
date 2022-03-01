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
        $order = Order::with(['fulfillments'])->find($orderID);
        $orderResource = new OrderResource($order);

        return Inertia::render(
            'Order/ReturnView',
            [
                'order' => $orderResource,
            ]
        );
    }
}
