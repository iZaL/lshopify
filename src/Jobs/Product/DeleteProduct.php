<?php

namespace IZal\Lshopify\Jobs\Product;

use IZal\Lshopify\Events\ProductDeleted;
use IZal\Lshopify\Models\Product;

class DeleteProduct
{
    private array $productID;

    public function __construct(array|string $productID)
    {
        $this->productID = $productID;
    }

    public function handle()
    {
        $productID = $this->productID;
        if (is_array($productID)) {
            foreach ($productID as $id) {
                self::deleteProduct($id);
            }
        } else {
            self::deleteProduct($productID);
        }
    }

    private static function deleteProduct($productID)
    {
        $product = Product::find($productID);
        $product->delete();
        event(new ProductDeleted($product));
    }
}
