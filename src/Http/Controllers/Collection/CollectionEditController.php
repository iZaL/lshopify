<?php

namespace IZal\Lshopify\Http\Controllers\Collection;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Collection;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Resources\CollectionResource;
use IZal\Lshopify\Resources\ProductResource;
use Inertia\Inertia;

class CollectionEditController extends Controller
{
    public function __invoke($id): \Inertia\Response
    {
        $collection = new CollectionResource(Collection::with(['conditions', 'products.image'])->find($id));
        $data = [
            'collection' => $collection,
            'products' => ProductResource::collection(Product::all()),
        ];

        return Inertia::render('Collection/CollectionEdit', $data);
    }
}
