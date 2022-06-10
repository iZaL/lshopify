<?php

namespace IZal\Lshopify\Jobs\Product\Variant;

class DeleteVariant
{
    public function delete($variant): self
    {
        $variant->delete();

        return $this;
    }
}
