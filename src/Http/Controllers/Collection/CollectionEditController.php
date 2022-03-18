<?php

namespace IZal\Lshopify\Http\Controllers\Collection;

use Illuminate\Http\Request;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Collection;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Resources\CollectionResource;
use IZal\Lshopify\Resources\ProductResource;
use Inertia\Inertia;

class CollectionEditController extends Controller
{
    public function __invoke(Request $request, $id): \Inertia\Response
    {
        $collection = new CollectionResource(Collection::with(['conditions', 'products.image'])->find($id));

        $products = Product::query();

        $searchTerm = $request->input('searchTerm');

        if ($searchTerm) {
            $products->where('title', 'like', "%{$searchTerm}%");
        }

        $products = ProductResource::collection($products->get());

        $data = [
            'collection' => $collection,
            'products' => $products,
        ];

        return Inertia::render('Collection/CollectionEdit', $data);
    }
}
