<?php

namespace IZal\Lshopify\Actions\Order;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use IZal\Lshopify\Cart\Cart;
use IZal\Lshopify\Cart\Collections\ItemCollection;
use IZal\Lshopify\Models\Discount;
use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Models\Variant;

class SyncCartVariants
{

    private Cart $cart;

    public function __construct(Cart $cart)
    {
        $this->cart = $cart;
    }

    /**
     * @param DraftOrder $order
     * @return void
     */
    public function create(DraftOrder $order): void
    {
        foreach ($this->cart->items() as $cartItem) {
            $this->attachVariantFromCartItem($order, $cartItem);
        }
    }

    public function update(DraftOrder $order): void
    {
        $oldVariants = $order->variants->modelKeys();
        $newVariants = [];
        foreach ($this->cart->items() as $cartItem) {
            $variant = Variant::find($cartItem->name);
            if($variant) {
                $newVariants[] = $variant->id;
                $this->updateVariantFromCartItem($order, $variant, $cartItem);
            }
        }

        // get diff of oldVariants and newVariants
        $diffVariants = collect($oldVariants)->diff($newVariants);
        $order->variants()->detach($diffVariants);
    }

    public function updateVariantFromCartItem(DraftOrder $order, Variant $variant, ItemCollection $cartItem): Variant
    {
        $variantDiscount = null;
        if ($cartCondition = $cartItem->getConditionByName($variant->id)) {
            $variantDiscount = $this->createVariantDiscount($order, $variant, $cartCondition);
        }
        $order->variants()->sync([$variant->id =>
            [
                'discount_id' => $variantDiscount?->id,
                ...$this->getCartItemData($cartItem)
            ],
        ],false);

        return $variant;
    }

    /**
     * @param DraftOrder $order
     * @param ItemCollection $cartItem
     * @return Variant
     */
    public function attachVariantFromCartItem(DraftOrder $order, ItemCollection $cartItem): Variant
    {
        $variant = Variant::find($cartItem->id);
        if ($variant) {
            $variantDiscount = null;
            if ($cartCondition = $cartItem->getConditionByName($variant->id)) {
                $variantDiscount = $this->createVariantDiscount($order, $variant, $cartCondition);
            }
            $order->variants()->attach($variant->id,
                array_merge(
                    ['discount_id' => $variantDiscount?->id],
                    $this->getCartItemData($cartItem)
                ));
        }
        return $variant;
    }

    /**
     * @param DraftOrder $order
     * @param Variant $variant
     * @param $itemCondition
     * @return Model|BelongsTo|null
     */
    private function createVariantDiscount(DraftOrder $order, Variant $variant, $itemCondition): Model|BelongsTo|null
    {
        $variantCondition = $order->variants()
            ->where('variant_id',$variant->id)
            ->whereNotNull('discount_id')
            ->first();

        if($variantCondition) {
            $discount = Discount::find(optional($variantCondition->pivot)->discount_id);
            $discount?->update([
                'value' => $itemCondition->value,
                'value_type' => $itemCondition->suffix === 'percent' ? 'percent' : 'amount',
                'reason' => $itemCondition->reason,
            ]);
        } else {
            $discount = $order->discount()->create([
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

    /**
     * @param  ItemCollection  $cartItem
     * @return array
     */
    private function getCartItemData(ItemCollection $cartItem): array
    {
        return [
            'price' => $cartItem->price(),
            'unit_price' => $cartItem->unit_price(),
            'total' => $cartItem->total(),
            'subtotal' => $cartItem->subtotal(),
            'quantity' => $cartItem->quantity(),
        ];
    }
}
