<?php

namespace IZal\Lshopify\Traits;

use IZal\Lshopify\Cart\Cart;
use IZal\Lshopify\Cart\Collections\CartCollection;
use IZal\Lshopify\Cart\Collections\ItemCollection;
use IZal\Lshopify\Models\Discount;
use IZal\Lshopify\Models\Variant;

trait DiscountService
{
    private string $name;
    private int $isAuto;


    public function attachDiscount($name = 'Admin cart discount', $isAuto = 1)
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

    public function createVariantDiscount(Variant $variant, ItemCollection $cartItem, $name = 'Admin discount', $isAuto = 1)
    {
        $itemCondition = $cartItem->getConditionByName($variant->id);

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

            if($orderVariant->pivot?->discount_id) {
                $discount = Discount::find(optional($orderVariant->pivot)->discount_id);
                $discount?->update($discountAttributes);
            } else {
                $discount = new Discount();
                $discount->fill($discountAttributes);
                $discount->save();
                $orderVariant->discounts()->attach($discount->id);
            }

        }
    }
}
