<?php

namespace IZal\Lshopify\Jobs\Order;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use IZal\Lshopify\Cart\Cart;
use IZal\Lshopify\Cart\Collections\ItemCollection;
use IZal\Lshopify\Models\Discount;
use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Traits\CartService;

trait SyncCartVariants
{
    private Cart $cart;

    public function __construct()
    {
        $this->cart = app('cart');
    }

    public function syncCartVariants(): void
    {
        foreach ($this->cart->items() as $cartItem) {
            $this->attachVariantFromCartItem($cartItem);
        }
    }

    public function update(DraftOrder $order): void
    {
        $oldVariants = $order->variants->modelKeys();
        $newVariants = [];
        foreach ($this->cart->items() as $cartItem) {
            $variant = Variant::find($cartItem->name);
            if ($variant) {
                $newVariants[] = $variant->id;
                $this->updateVariantFromCartItem($order, $variant, $cartItem);
            }
        }

        // get diff of oldVariants and newVariants
        $diffVariants = collect($oldVariants)->diff($newVariants);
        $order->variants()->detach($diffVariants);
    }

    private function updateVariantFromCartItem(DraftOrder $order, Variant $variant, ItemCollection $cartItem): Variant
    {
        $variantDiscount = null;
        if ($cartCondition = $cartItem->getConditionByName($variant->id)) {
            $variantDiscount = $this->createVariantDiscount($order, $variant, $cartCondition);
        }
        $order->variants()->sync(
            [
                $variant->id => [
                    'discount_id' => $variantDiscount?->id,
                    CartService::parseItem($cartItem),
                ],
            ],
            false
        );

        return $variant;
    }

    /**
     * @param ItemCollection $cartItem
     * @return Variant
     */
    private function attachVariantFromCartItem(ItemCollection $cartItem): Variant
    {
        $variant = Variant::find($cartItem->id);
        if ($variant) {
            $variantDiscount = null;
            if ($cartCondition = $cartItem->getConditionByName($variant->id)) {
                $variantDiscount = $this->createVariantDiscount($variant, $cartCondition);
            }
            $this
                ->variants()
                ->attach(
                    $variant->id,
                    array_merge(['discount_id' => $variantDiscount?->id], CartService::parseItem($cartItem))
                );
        }
        return $variant;
    }

    /**
     * @param Variant $variant
     * @param $itemCondition
     * @return Model|BelongsTo|null
     */
    private function createVariantDiscount(Variant $variant, $itemCondition): Model|BelongsTo|null
    {
        $variantCondition = $this
            ->variants()
            ->where('variant_id', $variant->id)
            ->whereNotNull('discount_id')
            ->first();

        if ($variantCondition) {
            $discount = Discount::find(optional($variantCondition->pivot)->discount_id);
            $discount?->update([
                'value' => $itemCondition->value,
                'value_type' => $itemCondition->suffix === 'percent' ? 'percent' : 'amount',
                'reason' => $itemCondition->reason,
            ]);
        } else {
            $discount = $this->discount()->create([
                'name' => 'Admin discount',
                'auto' => 1,
                'value' => $itemCondition->value,
                'value_type' => $itemCondition->suffix === 'percent' ? 'percent' : 'amount',
                'reason' => $itemCondition->reason,
            ]);
            $variant->discounts()->attach($discount->id);
        }
        return $discount;
    }


}
