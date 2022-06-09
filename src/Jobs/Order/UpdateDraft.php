<?php

namespace IZal\Lshopify\Jobs\Order;

use Illuminate\Support\Arr;
use IZal\Lshopify\Cart\Cart;
use IZal\Lshopify\Models\DraftOrder;

class UpdateDraft extends CreateOrder
{
    private Cart $cart;
    private AttachDiscount $attachDiscount;
    private SyncCartVariants $syncCartVariants;

    /**
     * DraftOrderCreateAction constructor.
     * @param Cart $cart
     * @param AttachDiscount $attachDiscount
     * @param SyncCartVariants $syncCartVariants
     */
    public function __construct(Cart $cart, AttachDiscount $attachDiscount, SyncCartVariants $syncCartVariants)
    {
        $this->cart = $cart;
        $this->attachDiscount = $attachDiscount;
        $this->syncCartVariants = $syncCartVariants;
    }

    /**
     * @param  DraftOrder  $order
     * @param  array  $attributes
     */
    public function update(DraftOrder $order, array $attributes)
    {
        $order->update(array_merge($this->cart->getCartData(), Arr::only($attributes, $order->getFillable())));
        $this->attachDiscount->run($order);
        $this->syncCartVariants->update($order);
    }
}
