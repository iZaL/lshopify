<?php

namespace IZal\Lshopify\Managers;

use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Models\Workflow;

class FulfillmentManager
{
    private Workflow $workflow;

    /**
     * @param Workflow $workflow
     */
    public function __construct(Workflow $workflow)
    {
        $this->workflow = $workflow;
    }

    /**
     * @param $variantAttribute
     * Field $id
     * Field $pivot_quantity
     */
    public function fulfillItems($variantAttribute)
    {
        $quantity = $variantAttribute['pivot_quantity'];
        if ($quantity > 0 && $variantAttribute['id'] != null) {
            $variant = Variant::find($variantAttribute['id']);
            if ($variant) {
                $qty = $variantAttribute['pivot_quantity'] ?? 1;
                $price = $variantAttribute['pivot_price'] ?? 0.0;
                $unitPrice = $variantAttribute['pivot_unit_price'] ?? 0.0;
                $this->workflow->variants()->attach($variantAttribute['id'], [
                    'quantity' => $qty,
                    'price' => $price,
                    'unit_price' => $unitPrice,
                    'total' => $qty * $price,
                    'subtotal' => $qty * $unitPrice,
                ]);
            }
        }
    }
}
