<?php

namespace IZal\Lshopify\Http\Controllers\Order\Draft;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Resources\OrderResource;
use Inertia\Inertia;

class DraftOrderIndexController extends Controller
{
    public function __invoke(): \Inertia\Response
    {
        $orders = OrderResource::collection(DraftOrder::latest()->get());
        $cart = app('cart');

        return Inertia::render('Order/Draft/DraftOrderIndex', ['orders' => $orders, 'cartTotal' => $cart->total()]);
    }
}
