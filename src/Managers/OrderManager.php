<?php

namespace IZal\Lshopify\Managers;

use IZal\Lshopify\Models\FulfillmentVariant;
use IZal\Lshopify\Models\Order;
use IZal\Lshopify\Models\Transaction;
use IZal\Lshopify\Models\Variant;

class OrderManager
{
    /**
     * @var Order
     */
    private $order;

    /**
     * OrderManager constructor.
     * @param  Order  $order
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Collect payment for the order.
     */
    public function collectManualPayment()
    {
        if ($this->order->isPaymentPending()) {
            $this->createPayment([
                'gateway' => Transaction::GATEWAY_MANUAL,
                'kind' => Transaction::KIND_SALE,
            ]);
        }
    }

    /**
     * Create a payment transaction.
     * @param $data
     */
    public function createPayment($data)
    {
        $payload = array_merge(
            [
                'amount' => $this->order->amount(),
                'currency' => 'OMR',
                'status' => Transaction::STATUS_SUCCESS,
            ],
            $data
        );
        $this->order->transactions()->create(\Arr::only($payload, (new Transaction())->getFillable()));
    }

    public function returnItems(array $variantAttributes, bool $restock = true, string $status = 'success')
    {
        foreach ($variantAttributes as $variantAttribute) {
            $variant = $this->order
                ->variants()
                ->wherePivot('variant_id', $variantAttribute['id'])
                ->first();

            $returnQuantity = $variantAttribute['pivot_quantity'];
            if ($variant && $returnQuantity != 0) {
                $this->createItemReturn($variant, $returnQuantity, $restock);
                $fulfillmentVariant = FulfillmentVariant::find($variantAttribute['pivot_id']);
                $actualQuantity = $fulfillmentVariant->quantity;
                $fulfillingQuantity = $variantAttribute['pivot_quantity'];
                $remainingQuantity = $actualQuantity - $fulfillingQuantity;
                if ($remainingQuantity <= 0) {
                    $fulfillmentVariant->delete();
                } else {
                    $fulfillmentVariant->quantity = $remainingQuantity;
                    $fulfillmentVariant->save();
                }
                $this->adjustOrderItemQuantities($variant, $returnQuantity, $status);
            }
        }
    }

    private function createItemReturn($variant, int $returnQuantity, $restock = true)
    {
        $order = $this->order;

        $order->returns()->attach($variant->id, [
            'quantity' => $returnQuantity,
            'price' => $variant->pivot->price,
            'unit_price' => $variant->pivot->unit_price,
            'total' => $variant->pivot->total,
            'subtotal' => $variant->pivot->subtotal,
            'restock' => 1,
        ]);

        if ($restock) {
            $this->restock($variant, $returnQuantity);
        }
    }

    private function restock($variant, $returnQuantity)
    {
        $actualQuantity = $variant->quantity;
        $remainingQuantityInStockAfterReturning = $actualQuantity + $returnQuantity;
        $variant->quantity = $remainingQuantityInStockAfterReturning;
        $variant->save();
    }

    private function adjustOrderItemQuantities(Variant $variant, $returningQuantity, $status)
    {
        $actualQuantity = $variant->pivot->quantity;
        $remainingQuantityInStockAfterReturning = $actualQuantity - $returningQuantity;

        if ($remainingQuantityInStockAfterReturning <= 0) {
            $this->removeItemFromOrder($variant);
            //            $this->removeItemFromDiscount($variant);
        } else {
            $variant->pivot->quantity = $remainingQuantityInStockAfterReturning;
            $variant->pivot->save();
        }

        $this->cancelFulfillment($variant, $returningQuantity, $status);
    }

    private function removeItemFromOrder(Variant $variant)
    {
        $order = $this->order;
        //@todo: remove variant from order variants
        $order->variants()->detach($variant->id);
        //@todo: remove variant from discount
        //@todo: remove variant from fulfillment
    }
}
