<?php

namespace IZal\Lshopify\Http\Controllers\Order\Fulfillment;

use Inertia\Inertia;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Resources\OrderResource;

class ReturnIndexController extends Controller
{
    public function __invoke($orderID): \Inertia\Response
    {
        $order = Order::with(['success_fulfillments'])->find($orderID);
        $orderResource = new OrderResource($order);

        return Inertia::render(
            'Order/ReturnView',
            [
                'order' => $orderResource,
            ]
        );
    }
}
