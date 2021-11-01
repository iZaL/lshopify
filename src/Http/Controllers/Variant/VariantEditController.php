<?php

namespace IZal\Lshopify\Http\Controllers\Variant;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Resources\ProductResource;
use IZal\Lshopify\Resources\VariantResource;
use Inertia\Inertia;

class VariantEditController extends Controller
{
    public function __invoke($productID, $variantID): \Inertia\Response
    {
        $product = Product::with(['images', 'variants'])->find($productID);
        $variant = Variant::find($variantID);
        $product = new ProductResource($product);
        $data = [
            'product' => $product,
            'variant' => new VariantResource($variant),
        ];

        return Inertia::render('Product/Variant/VariantEdit', $data);
    }
}
