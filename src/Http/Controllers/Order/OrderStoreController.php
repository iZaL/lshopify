<?php

namespace IZal\Lshopify\Http\Controllers\Order;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\OrderStoreRequest;

class OrderStoreController extends Controller
{
    public function __invoke(OrderStoreRequest $request): \Illuminate\Http\RedirectResponse
    {
        return redirect()->route('lshopify.orders.index');
    }

    public function createFromDraftOrder($draftOrderID)
    {
    }
}
