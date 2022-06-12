<?php

namespace IZal\Lshopify\Traits;

use IZal\Lshopify\Cart\Collections\ItemCollection;
use IZal\Lshopify\Models\Variant;

trait CartService
{
    protected $cart;
    public function __construct()
    {
        $this->cart = app('cart');
    }

    /**
     * @param ItemCollection $cartItem
     * @return array
     */
    public static function parseItem(ItemCollection $cartItem): array
    {
        return [
            'price' => $cartItem->price(),
            'unit_price' => $cartItem->unit_price(),
            'total' => $cartItem->total(),
            'subtotal' => $cartItem->subtotal(),
            'quantity' => $cartItem->quantity(),
        ];
    }

    public function syncCartVariants(): void
    {
        foreach ($this->cart->items() as $cartItem) {
            $this->attachVariantFromCartItem($cartItem);
        }
    }

    /**
     * @param ItemCollection $cartItem
     * @return Variant
     */
    public function attachVariantFromCartItem(ItemCollection $cartItem): Variant
    {
        $variant = Variant::find($cartItem->id);
        if ($variant) {
            $this->variants()->attach($variant->id, CartService::parseItem($cartItem));
            $this->updateVariantDiscount($variant, $cartItem);
        }
        return $variant;
    }

    public function updateCartVariants(): void
    {
        $oldVariants = $this->variants->modelKeys();
        $newVariants = [];
        foreach ($this->cart->items() as $cartItem) {
            $variant = Variant::find($cartItem->name);
            if ($variant) {
                $newVariants[] = $variant->id;
                $this->updateVariantFromCartItem($variant, $cartItem);
            }
        }

        // get diff of oldVariants and newVariants
        $diffVariants = collect($oldVariants)->diff($newVariants);
        $this->variants()->detach($diffVariants);
    }

    public function updateVariantFromCartItem(Variant $variant, ItemCollection $cartItem): Variant
    {
        $this->variants()->sync(
            [
                $variant->id => self::parseItem($cartItem),
            ],
            false
        );

        $this->updateVariantDiscount($variant, $cartItem);

        return $variant;
    }
}
