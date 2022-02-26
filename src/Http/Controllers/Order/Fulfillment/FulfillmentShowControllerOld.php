<?php

namespace IZal\Lshopify\Http\Controllers\Order\Fulfillment;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Customer;
use IZal\Lshopify\Models\Fulfillment;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Resources\CustomerResource;
use IZal\Lshopify\Resources\FulfillmentResource;
use IZal\Lshopify\Resources\OrderResource;
use Inertia\Inertia;

class FulfillmentShowControllerOld extends Controller
{
    public function __invoke($orderID): \Inertia\Response
    {
        $fulfillment = Fulfillment::with(['variants.product'])->find($fulfillmentID);
        $fulfillmentResource = new FulfillmentResource($fulfillment);

        $order = Order::with(['customer'])->find($orderID);
        $orderResource = new OrderResource($order);

        $customers = CustomerResource::collection(Customer::all());

        return Inertia::render(
            'Order/FulfillmentView',
            [
                'fulfillment' => $fulfillmentResource,
                'order' => $orderResource,
                'customers' => $customers,
            ]
        );
    }
}
