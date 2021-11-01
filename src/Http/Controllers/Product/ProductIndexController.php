<?php

namespace IZal\Lshopify\Http\Controllers\Product;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Resources\ProductResource;
use Inertia\Inertia;

class ProductIndexController extends Controller
{
    public function __invoke(): \Inertia\Response
    {
        $products = ProductResource::collection(Product::latest()->get());

        return Inertia::render('Product/ProductIndex', ['products' => $products]);
    }
}
