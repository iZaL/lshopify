<?php

namespace IZal\Lshopify\Http\Controllers\Order\Fulfillment;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\ReturnRequest;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\Workflow;

class ReturnStoreController extends Controller
{
    public function __invoke($orderID, ReturnRequest $request)
    {
        $order = Order::with(['workflows.variants'])->find($orderID);

        $fulfillments = $request->fulfillments;

        foreach ($fulfillments as $fulfillment) {
            $workflow = $order->workflows->where('id', $fulfillment['id'])->first();
            if ($workflow) {
                // loop through fulfillment variants and subtract the pivot quantity
                // add those pivot quantity to new workflow called returned

                $fulfillmentVariants = collect($fulfillment['variants'])->reject(function ($variant) {
                    return $variant['pivot_quantity'] == 0;
                });

                if ($fulfillmentVariants->count() > 0) {
                    $newWorkflow = $order->workflows()->create(['type' => Workflow::TYPE_RETURNED]);

                    foreach ($fulfillmentVariants as $fulfillmentVariant) {
                        $workflowVariant = $workflow->variants->where('id', $fulfillmentVariant['id'])->first();
                        if ($workflowVariant) {
                            $workflowVariant->pivot->quantity =
                                $workflowVariant->pivot->quantity - $fulfillmentVariant['pivot_quantity'];
                            $workflowVariant->pivot->save();

                            // create new workflow variant
                            $newWorkflow
                                ->variants()
                                ->attach($fulfillmentVariant['id'], [
                                    'quantity' => $fulfillmentVariant['pivot_quantity'],
                                ]);
                        }
                    }
                }
            }
        }

        return redirect()
            ->route('lshopify.orders.show', $orderID)
            ->with('success', 'Return created successfully');
    }
}
