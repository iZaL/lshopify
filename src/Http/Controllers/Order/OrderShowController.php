<?php

namespace IZal\Lshopify\Http\Controllers\Order;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Resources\OrderResource;
use Inertia\Inertia;

class OrderShowController extends Controller
{
    public function __invoke($id): \Inertia\Response
    {
        $order = Order::with([
            'pending_fulfillments.variants',
            'success_fulfillments.variants',
            'success_payments',
            'returns',
        ])->find($id);

//        dd($order);

        $orderResource = new OrderResource($order);

        return Inertia::render('Order/OrderView', ['order' => $orderResource]);
    }
}
