<?php

namespace IZal\Lshopify\Http\Controllers\Product;

use Inertia\Inertia;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Resources\ProductResource;

class ProductBulkEditController extends Controller
{
    public function __invoke(): \Inertia\Response
    {
        $products = Product::with(['images', 'variants.image', 'category', 'tags', 'collections'])->get();

        $products = ProductResource::collection($products);

        $data = [
            'products' => $products,
        ];

        return Inertia::render('Product/ProductBulkEdit', $data);
    }
}
