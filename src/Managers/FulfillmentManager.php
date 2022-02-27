<?php

namespace IZal\Lshopify\Managers;

use IZal\Lshopify\Models\Fulfillment;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Models\Workflow;

class FulfillmentManager
{

    /**
     * @var Fulfillment
     */
    private $fulfillment;

    protected $variant;

    protected $quantity;

    public function __construct(Workflow $fulfillment)
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
    public function fulfillItems(Workflow $fulfillment,$variantAttribute)
    {
        $fulfillment->variants()->attach(
            $variantAttribute['id'],
        [
            'quantity' => $variantAttribute['pivot_quantity'],
            'price' => $variantAttribute['pivot_price'],
            'unit_price' => $variantAttribute['pivot_unit_price'],
            'total' => $variantAttribute['pivot_total'],
            'subtotal' => $variantAttribute['pivot_subtotal'],
        ]);
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
                'price' => $variant->pivot_price,
                'unit_price' => $variant->pivot_unit_price,
                'total' => $variant->pivot_total,
                'subtotal' => $variant->pivot_subtotal,
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

}
