<?php

namespace IZal\Lshopify\Http\Controllers\Order\Transaction;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\RefundRequest;
use IZal\Lshopify\Models\Order;

class RefundController extends Controller
{

    public function __invoke($orderID, RefundRequest $request)
    {
        $order = Order::with(['variants','workflows.variants'])->find($orderID);

        $pendingFulfillments = collect($request->pending_fulfillments)->reject(function ($fulfillment) {
            return $fulfillment['pivot_quantity'] == 0;
        });

        if($pendingFulfillments->count() > 0) {
            $removedWorkflow = $order->workflows()->create([
                'type' => 'remove',
            ]);

            foreach ($pendingFulfillments as $pendingFulfillment) {
                $variant = $order->variants->firstWhere('id', $pendingFulfillment['id']);
                if ($variant) {
                    $refundingQuantity = $pendingFulfillment['pivot_quantity'];
                    if ($refundingQuantity > 0) {
                        $variant->pivot->quantity -= $refundingQuantity;
//                    $variant->pivot->save();
                        $removedWorkflow->variants()->attach($variant->id, [
                            'quantity' => $refundingQuantity,
                            'price' => $variant->pivot->price,
                            'unit_price' => $variant->pivot->unit_price,
                            'total' => $refundingQuantity * $variant->pivot->unit_price,
                            'subtotal' => $refundingQuantity * $variant->pivot->unit_price,
                        ]);
                    }
                }
            }
        }

        $fulfillments = collect($request->fulfillments)->reject(function ($fulfillment) {
            return $fulfillment['pivot_quantity'] == 0;
        });

        foreach ($fulfillments as $fulfillment) {
            $variant = $order->variants->firstWhere('id', $fulfillment['id']);
            if($variant) {
                $refundingQuantity = $fulfillment['pivot_quantity'];
                if ($refundingQuantity > 0) {
                    // create refund
                    // create remove workflow
                    $removedWorkflow = $order->workflows()->create([
                        'type' => 'remove',
                    ]);
                    $removedWorkflow->variants()->attach($variant->id, [
                        'quantity' => $refundingQuantity,
                        'price' => $variant->pivot->price,
                        'unit_price' => $variant->pivot->unit_price,
                        'total' => $refundingQuantity * $variant->pivot->unit_price,
                        'subtotal' => $refundingQuantity * $variant->pivot->unit_price,
                    ]);
                }
            }
        }

        return redirect()->route('lshopify.orders.show', $order->id)->with('success', 'Saved');
    }
}












