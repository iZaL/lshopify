<?php

namespace IZal\Lshopify\Events\Cart;

use Illuminate\Support\Facades\Event;

class CartItemAdded
{
    public function __construct($cartItem)
    {
    }
}
