<?php

namespace IZal\Lshopify\Cart\Collections;

use Illuminate\Support\Collection;

class ItemAttributesCollection extends Collection
{
    /**
     * Returns the total price of all the attributes together.
     *
     * @return float
     */
    public function getTotal()
    {
        return $this->sum('price');
    }
}
