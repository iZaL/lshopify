<?php

namespace IZal\Lshopify\Http\Controllers\Product;

use Illuminate\Http\Request;
use Inertia\Inertia;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Resources\ProductResource;

class ProductBulkEditController extends Controller
{
    public function __invoke(Request $request): \Inertia\Response
    {
        $productIDs = $request->product_ids;
        $products = Product::with(['images', 'variants.image', 'category', 'tags', 'collections','default_variant'])->whereIn('id',$productIDs)->get();
        $products = ProductResource::collection($products);
        $data = [
            'products' => $products,
        ];

        return Inertia::render('Product/ProductBulkEdit', $data);
    }
}
