<?php

namespace IZal\Lshopify\Managers;

use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Models\Workflow;

class FulfillmentManager
{
    /**
     * @param $variantAttribute
     * Field $id
     * Field $pivot_quantity
     */
    public function fulfillItems(Workflow $fulfillment,$variantAttribute)
    {
        $quantity = $variantAttribute['pivot_quantity'];
        if($quantity > 0 && $variantAttribute['id'] != null) {
            $variant = Variant::find($variantAttribute['id']);
            if($variant) {
                $fulfillment->variants()->attach(
                    $variantAttribute['id'],
                    [
                        'quantity' => $variantAttribute['pivot_quantity'],
                        'price' => $variantAttribute['pivot_price'],
                        'unit_price' => $variantAttribute['pivot_unit_price'],
                        'total' => $variantAttribute['pivot_quantity'] * $variantAttribute['pivot_price'],
                        'subtotal' => $variantAttribute['pivot_quantity'] * $variantAttribute['pivot_unit_price'],
                    ]);
            }
        }
    }

}
