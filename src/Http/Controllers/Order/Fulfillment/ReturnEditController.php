<?php

namespace IZal\Lshopify\Http\Controllers\Order\Fulfillment;

use Illuminate\Http\Request;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Order;

class ReturnEditController extends Controller
{
    public function __invoke($orderID, $returnID, Request $request)
    {
        $order = Order::findOrFail($orderID);
        $return = $order->returns()->findOrFail($returnID);

        $return->update($request->only(['status']));
        return redirect()->route('lshopify.orders.show', $orderID);
    }
}
