<?php

namespace IZal\Lshopify\Http\Controllers\Order;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Resources\OrderResource;
use Inertia\Inertia;

class OrderEditController extends Controller
{
    public function __invoke($id): \Inertia\Response
    {
        $order = Order::find($id);
        $orderResource = new OrderResource($order);

        return Inertia::render('Order/OrderEdit', ['order' => $orderResource]);
    }
}
