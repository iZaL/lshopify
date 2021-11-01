<?php

namespace IZal\Lshopify\Actions;

class VariantDeleteAction
{
    public function delete($variant): self
    {
        $variant->delete();

        return $this;
    }
}
