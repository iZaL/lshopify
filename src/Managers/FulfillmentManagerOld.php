<?php

namespace IZal\Lshopify\Managers;

use IZal\Lshopify\Models\Fulfillment;
use IZal\Lshopify\Models\Variant;

class FulfillmentManagerOld
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
    public function fulfillItems(
        Fulfillment $pendingFulfillment,
        $variantAttribute
    ) {
        $this->variant = $pendingFulfillment
            ->variants()
            ->firstWhere('variant_id', $variantAttribute['id']);
        if ($this->variant) {
            $this->quantity = $variantAttribute['pivot_quantity'];
            if ($this->quantity != 0) {
                $this->createFulfillment()->adjustQuantity($pendingFulfillment);
            }
        }
    }

    /**
     * @return $this
     */
    public function createFulfillment(): FulfillmentManager
    {
        $variant = $this->variant;
        $this->fulfillment->variants()->attach($variant->id, [
            'quantity' => $this->quantity,
            'price' => $variant->pivot->price,
            'unit_price' => $variant->pivot->unit_price,
            'total' => $variant->pivot->total,
            'subtotal' => $variant->pivot->subtotal,
            'status' => 'success',
        ]);
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
}
