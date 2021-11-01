<?php

namespace IZal\Lshopify\Http\Controllers\Order;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Resources\OrderResource;
use Inertia\Inertia;

class OrderIndexController extends Controller
{
    public function __invoke(): \Inertia\Response
    {
        $orders = OrderResource::collection(Order::latest()->get());

        return Inertia::render('Order/OrderIndex', ['orders' => $orders]);
    }
}
