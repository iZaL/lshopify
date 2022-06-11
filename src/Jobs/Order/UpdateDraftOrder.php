<?php

namespace IZal\Lshopify\Jobs\Order;

use Illuminate\Support\Arr;
use IZal\Lshopify\Cart\Cart;
use IZal\Lshopify\Models\DraftOrder;

class UpdateDraftOrder
{
    private Cart $cart;
    private array $attributes;
    private DraftOrder $order;

    public function __construct(DraftOrder $order, array $attributes)
    {
        $this->cart = app('cart');
        $this->attributes = $attributes;
        $this->order = $order;
    }

    public function handle()
    {
        $attributes = $this->attributes;
        $order = $this->order;
        $order->update(array_merge($this->cart->getCartData(), $attributes));

        if (isset($attributes['shipping'])) {
            $order->updateShippingAddress($attributes['shipping']);
        }

        if (isset($attributes['billing'])) {
            $order->updateBillingAddress($attributes['billing']);
        }

        // Create Order Discount
        $order->createCartDiscount();

        // Sync cart variants
        $order->updateCartVariants();
    }
}
