<?php

namespace IZal\Lshopify\Actions\Order;

use Illuminate\Support\Arr;
use IZal\Lshopify\Cart\Cart;
use IZal\Lshopify\Cart\Collections\ItemCollection;
use IZal\Lshopify\Models\DraftOrder;
use IZal\Lshopify\Models\Variant;

class DraftOrderUpdateAction extends OrderCreateAction
{

    /**
     * @var Variant
     */
    private $variant;
    private Cart $cart;
    private UpdateDiscount $updateDiscount;

    /**
     * DraftOrderCreateAction constructor.
     * @param DraftOrder $order
     * @param Variant $variant
     * @param Cart $cart
     * @param AddDiscount $addDiscount
     */
    public function __construct(DraftOrder $order, Variant $variant, Cart $cart, AddDiscount $addDiscount,UpdateDiscount $updateDiscount)
    {
        $this->variant = $variant;
        $this->cart = $cart;
        $this->addDiscount = $addDiscount;
        $this->updateDiscount = $updateDiscount;
    }

    /**
     * @param  DraftOrder  $order
     * @param  array  $attributes
     */
    public function update(DraftOrder $order, array $attributes)
    {
        $order->update(array_merge($this->getCartData(), Arr::only($attributes, $order->getFillable())));
        $this->updateDiscount->run($order);
        $this->syncVariantsFromCart($order);
    }

    /**
     * @param DraftOrder $order
     * @return void
     */
    private function syncVariantsFromCart(DraftOrder $order): void
    {
        $oldVariants = $order->variants->modelKeys();
        $newVariants = [];
        foreach ($this->cart->items() as $cartItem) {
            $variant = $this->variant->find($cartItem->name);
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
