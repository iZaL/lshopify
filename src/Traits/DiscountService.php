<?php

namespace IZal\Lshopify\Traits;

use IZal\Lshopify\Cart\Collections\ItemCollection;
use IZal\Lshopify\Models\Discount;
use IZal\Lshopify\Models\Variant;

trait DiscountService
{

    public function createCartDiscount($name = 'Admin cart discount', $isAuto = 1)
    {
        $order = $this;
        $cart = app('cart');
        $cartDiscount = $cart->getConditionByName('cart');

        if($cartDiscount) {
            $discountAttributes = [
                'auto' => $isAuto,
                'name' => $name,
                'value' => $cartDiscount->value,
                'value_type' => $cartDiscount->suffix === 'percent' ? 'percent' : 'amount',
                'reason' => $cartDiscount->reason,
            ];

            if($order->discount) {
                $order->discount->update($discountAttributes);
            } else {
                $discount = new Discount();
                $discount->fill($discountAttributes);
                $discount->save();
                $order->discount()->associate($discount);
                $order->save();
            }
        } else {
            $order->removeDiscount();
        }
    }

    public function updateVariantDiscount(Variant $variant, ItemCollection $cartItem, $name = 'Admin discount', $isAuto = 1)
    {
        $itemCondition = $cartItem->getConditionByName($variant->id);

        if($itemCondition) {

            $orderVariant = $this
                ->variants()
                ->where('variant_id', $variant->id)
                ->first();

            if ($orderVariant) {

                $discountAttributes = [
                    'name' => $name,
                    'auto' => $isAuto,
                    'value' => $itemCondition->value,
                    'value_type' => $itemCondition->suffix === 'percent' ? 'percent' : 'amount',
                    'reason' => $itemCondition->reason,
                ];

                if($orderVariant->pivot->discount_id) {
                    $discount = Discount::find(optional($orderVariant->pivot)->discount_id);
                    if($discount) {
                        $discount?->update($discountAttributes);
                    } else {
                        $this->createDiscount($orderVariant, $discountAttributes);
                    }
                } else {
                    // create discount
                    $this->createDiscount($orderVariant, $discountAttributes);
                }

            }
        }


    }

    public function createDiscount(Variant $variant, $discountAttributes) {
        $discount = new Discount();
        $discount->fill($discountAttributes);
        $discount->save();

        // attach discount to variant
        $variant->discounts()->attach($discount->id);

        // update order pivot model with the discount
        $variant->pivot->discount_id = $discount->id;
        $variant->push();
    }

}
