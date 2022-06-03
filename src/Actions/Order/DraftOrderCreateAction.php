<?php

namespace IZal\Lshopify\Actions\Order;

use IZal\Lshopify\Cart\Cart;
use IZal\Lshopify\Models\DraftOrder;

class DraftOrderCreateAction extends OrderCreateAction
{

    private AttachDiscount $addDiscount;
    private SyncCartVariants $syncCartVariants;
    private Cart $cart;

    /**
     * DraftOrderCreateAction constructor.
     * @param Cart $cart
     * @param AttachDiscount $addDiscount
     * @param SyncCartVariants $syncCartVariants
     */
    public function __construct(Cart $cart, AttachDiscount $addDiscount, SyncCartVariants $syncCartVariants)
    {
        $this->addDiscount = $addDiscount;
        $this->syncCartVariants = $syncCartVariants;
        $this->cart = $cart;
    }

    /**
     * @return DraftOrder
     */
    public function run(): DraftOrder
    {
        $order = DraftOrder::create($this->cart->getCartData());
        $this->addDiscount->attach($order);
        $this->syncCartVariants->create($order);
        return $order;
    }

}
