<?php

namespace IZal\Lshopify\Jobs;

class VariantDeleteAction
{
    public function delete($variant): self
    {
        $variant->delete();

        return $this;
    }
}
