<?php

namespace IZal\Lshopify\Jobs\Cart;

use IZal\Lshopify\Cart\Cart;
use IZal\Lshopify\Events\Cart\CartItemAdded;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Resources\VariantResource;

class AddCartItem
{
    protected $variants;
    /**
     * @var false
     */
    private bool $sync;

    protected $cart;

    public function __construct(array $variantIDs, $sync = false)
    {
        $this->variants = Variant::with(['product'])->find($variantIDs);
        $this->sync = $sync;
        $this->cart = app('cart');
    }

    public function handle(): Cart
    {
        $variants = $this->variants;
        $cart = $this->cart;
        if ($this->sync) {
            foreach ($cart->items() as $item) {
                if (!in_array($item->id, $variants->pluck('id')->all())) {
                    $cart->remove($item->rowId);
                }
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
                    event(new CartItemAdded($cartItem));
                }
            }
        }
        return $cart;
    }
}
