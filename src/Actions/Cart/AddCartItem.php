<?php

namespace IZal\Lshopify\Actions\Cart;

use Illuminate\Http\Request;
use IZal\Lshopify\Cart\Cart;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Resources\VariantResource;

class AddCartItem
{
    public function run(array $variantIDs): Cart
    {
        $cart = app('cart');
        $variants = Variant::with(['product'])->find($variantIDs);
        foreach ($cart->items() as $item) {
            if (!in_array($item->id, $variantIDs)) {
                $cart->remove($item->rowId);
            }
        }
        if ($variants->count()) {
            foreach ($variants as $variant) {
                $cartItem = $cart->find(['id' => $variant->id]);
                if (!$cartItem) {
                    $cart->add([
                        'id' => $variant->id,
                        'name' => $variant->id,
                        'price' => $variant->price,
                        'quantity' => 1,
                        'variant' => new VariantResource($variant),
                    ]);
                }
            }
        }
        return $cart;
    }
}
