<?php

namespace IZal\Lshopify\Http\Controllers\Product;

use Illuminate\Http\Request;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Resources\ProductResource;
use Inertia\Inertia;

class ProductIndexController extends Controller
{
    public function __invoke(Request $request): \Inertia\Response
    {

        $products = Product::query();

        $searchTerm  = $request->get('search');

        if($searchTerm) {
            $products->where('title', 'like', '%'.$searchTerm.'%');
        }

        $status = $request->status ?? 'All';
        if($status && $status != 'All') {
            $products->where('status', $request->status);
        }

        $products = ProductResource::collection($products->get());


        return Inertia::render('Product/ProductIndex', ['products' => $products, 'statuses' => ['All', 'Published', 'Draft'], 'search' => $searchTerm, 'status' => $status]);
    }
}
