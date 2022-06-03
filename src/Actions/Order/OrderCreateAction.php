<?php

namespace IZal\Lshopify\Actions\Order;

use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Models\Order;

class OrderCreateAction
{
    public function createOrderFromDraft(DraftOrder $draftOrder)
    {
        abort_unless($draftOrder->draft(), 403);
        $draftOrder->forceFill(['draft' => 0]);
        $draftOrder->save();
    }

    public function createOrderFulfillment(Order $order)
    {
        abort_if($order->draft(), 403);
    }

}
