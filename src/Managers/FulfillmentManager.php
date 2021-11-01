<?php

namespace IZal\Lshopify\Managers;

use IZal\Lshopify\Models\Fulfillment;
use IZal\Lshopify\Models\Variant;

class FulfillmentManager
{

    /**
     * @var Fulfillment
     */
    private $fulfillment;

    protected $variant;

    protected $quantity;

    public function __construct(Fulfillment $fulfillment)
    {
        $this->fulfillment = $fulfillment;
    }

    /**
     * @param  Variant  $variant
     */
    public function setVariant(Variant $variant)
    {
        $this->variant = $variant;
    }

    /**
     * @param  int  $quantity
     */
    public function setQuantity(int $quantity)
    {
        $this->quantity = $quantity;
    }

    /**
     * @param $variantAttribute
     * Field $id
     * Field $pivot_quantity
     */
    public function fulfillItems(Fulfillment $pendingFulfillment,$variantAttribute)
    {
        $this->variant = $pendingFulfillment->variants()->firstWhere('variant_id',$variantAttribute['id']);
        if($this->variant) {
            $this->quantity = $variantAttribute['pivot_quantity'];
            if ($this->quantity != 0) {
                $this
                    ->createFulfillment()
                    ->adjustQuantity($pendingFulfillment)
                ;
            }
        }
    }

    /**
     * @return $this
     */
    public function createFulfillment(): FulfillmentManager
    {
        $variant = $this->variant;
        $this->fulfillment->variants()->attach(
            $variant->id,
            [
                'quantity' => $this->quantity,
                'price' => $variant->pivot->price,
                'unit_price' => $variant->pivot->unit_price,
                'total' => $variant->pivot->total,
                'subtotal' => $variant->pivot->subtotal,
                'status' => 'success',
            ]
        );
        return $this;
    }

    /**
     * @param  Fulfillment  $pendingFulfillment
     */
    public function adjustQuantity(Fulfillment $pendingFulfillment)
    {
        $variant = $this->variant;
        $previousQuantity = $variant->pivot->quantity;
        $remainingQuantity = $previousQuantity - $this->quantity;
        if ($remainingQuantity <= 0) {
            $pendingFulfillment->variants()->detach($variant->id);
        } else {
            $variant->pivot->quantity = $remainingQuantity;
            $variant->pivot->save();
        }
    }

//    private function cancelFulfillment(Variant $variant, $fulfillQuantity, $status)
//    {
//        $fulfillments = $this->order->success_fulfillments();
//
//        if ($status === 'pending') {
//            $fulfillments = $this->order->pending_fulfillments();
//        }
//
//        $fulfillments = $fulfillments->whereHas('variants', function ($q) use ($variant) {
//            $q->where('variant_id', $variant->id);
//        })->get();
//
//        foreach ($fulfillments as $fulfillment) {
//            foreach ($fulfillment->variants as $fulfillmentVariant) {
//                $pivot = $fulfillmentVariant->pivot;
//                if ($pivot->quantity === $fulfillQuantity) {
//                    $fulfillmentVariant->detach($variant->id);
//                    break;
//                } elseif ($pivot->quantity > $fulfillQuantity) {
//                    $pivot->quantity = $pivot->quantity - $fulfillQuantity;
//                    $pivot->save();
//                    break;
//                }
//            }
//        }
//
//    }

}
