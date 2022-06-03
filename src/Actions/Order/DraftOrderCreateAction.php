<?php

namespace IZal\Lshopify\Actions\Order;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use IZal\Lshopify\Cart\Cart;
use IZal\Lshopify\Cart\Collections\ItemCollection;
use IZal\Lshopify\Models\Discount;
use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Models\Variant;

class DraftOrderCreateAction extends OrderCreateAction
{
    /**
     * @var DraftOrder
     */
    private $order;
    /**
     * @var Variant
     */
    private $variant;
    private Cart $cart;
    private AddDiscount $addDiscount;

    /**
     * DraftOrderCreateAction constructor.
     * @param DraftOrder $order
     * @param Variant $variant
     * @param Cart $cart
     * @param AddDiscount $addDiscount
     */
    public function __construct(DraftOrder $order, Variant $variant, Cart $cart, AddDiscount $addDiscount)
    {
        $this->order = $order;
        $this->variant = $variant;
        $this->cart = $cart;
        $this->addDiscount = $addDiscount;
    }

    /**
     * @return DraftOrder
     */
    public function create(): DraftOrder
    {
        $order = $this->order->create($this->getCartData());
        $this->addDiscount->run($order);
        $this->syncCartVariants($order);
        return $order;
    }

    /**
     * @param DraftOrder $order
     * @return void
     */
    private function syncCartVariants(DraftOrder $order): void
    {
        foreach ($this->cart->items() as $cartItem) {
            $this->attachVariantFromCartItem($order, $cartItem);
        }
    }

    /**
     * @param DraftOrder $order
     * @param ItemCollection $cartItem
     * @return Variant
     */
    public function attachVariantFromCartItem(DraftOrder $order, ItemCollection $cartItem): Variant
    {
        $variant = $this->variant->find($cartItem->id);
        if ($variant) {
            $variantDiscount = null;
            if ($cartCondition = $cartItem->getConditionByName($variant->id)) {
                $variantDiscount = $this->createVariantDiscount($order, $variant, $cartCondition);
            }
            $order->variants()->sync($variant->id,
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
     * @return array
     */
    private function getCartData(): array
    {
        $cart = $this->cart;
        return [
            'total' => $cart->total(),
            'subtotal' => $cart->subtotal(),
            'quantity' => $cart->quantity(),
        ];
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
