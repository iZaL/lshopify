<?php

namespace IZal\Lshopify\Http\Controllers\Variant;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Resources\ProductResource;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VariantCreateController extends Controller
{
    public function __invoke($productID, Request $request): \Inertia\Response
    {
        $product = Product::with(['images', 'variants'])->find($productID);
        $product = new ProductResource($product);
        $data = [
            'product' => $product,
            'variant_options' => $product->variant_options,
        ];

        return Inertia::render('Product/Variant/VariantCreate', $data);
    }
}
