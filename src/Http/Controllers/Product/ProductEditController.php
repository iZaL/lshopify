<?php

namespace IZal\Lshopify\Http\Controllers\Product;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Category;
use IZal\Lshopify\Models\Collection;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Tag;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Resources\CategoryResource;
use IZal\Lshopify\Resources\CollectionResource;
use IZal\Lshopify\Resources\ProductResource;
use Inertia\Inertia;

class ProductEditController extends Controller
{
    public function __invoke($id): \Inertia\Response
    {
        $product = Product::with(['images', 'variants.image', 'category', 'tags', 'collections'])->find($id);

        $product = new ProductResource($product);

        $data = [
            'product' => $product,
            'collection' => CollectionResource::collection(Collection::all()),
            'tags' => Tag::all(),
            'variants' => Variant::defaultVariants(),
            'product_types' => CategoryResource::collection(Category::all()),
            'variant_options' => $product->variant_options,
            'variant_values' => $product->variant_options_values,
        ];

        return Inertia::render('Product/ProductEdit', $data);
    }
}
