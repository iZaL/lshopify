<?php

namespace IZal\Lshopify\Jobs;

use IZal\Lshopify\Events\VendorCreated;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Vendor;

class CreateVendor
{
    private array $attributes;

    public function __construct(array $attributes)
    {
        $this->attributes = $attributes;
    }

    public function handle(): Vendor
    {
        $attributes = $this->attributes;
        $vendor = new Vendor();
        $vendor->fill($attributes);
        $vendor = tap($vendor)->save();

        if ($attributes['product_id']) {
            $product = Product::find($attributes['product_id']);
            if ($product) {
                $product->vendor()->associate($vendor);
                $product->save();
            }
        }

        event(new VendorCreated($vendor));

        return $vendor;
    }
}
