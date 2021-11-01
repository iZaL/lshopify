<?php

namespace IZal\Lshopify\Http\Controllers\Order\Draft;

use IZal\Lshopify\Actions\OrderCreateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\DraftOrder;

class DraftOrderConfirmController extends Controller
{
    public function __invoke($id, OrderCreateAction $action): \Illuminate\Http\RedirectResponse
    {
        $draftOrder = DraftOrder::find($id);

        $action->createOrderFromDraft($draftOrder);

        return redirect()
            ->route('lshopify.orders.show', $draftOrder->id)
            ->with('success', 'Created Order');
    }
}
