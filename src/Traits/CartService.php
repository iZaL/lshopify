<?php

namespace IZal\Lshopify\Traits;

use IZal\Lshopify\Cart\Collections\ItemCollection;

trait CartService
{
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
}
