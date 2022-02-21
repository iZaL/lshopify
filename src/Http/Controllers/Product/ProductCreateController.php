<?php

namespace IZal\Lshopify\Http\Controllers\Product;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Category;
use IZal\Lshopify\Models\Collection;
use IZal\Lshopify\Models\Tag;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Resources\CategoryResource;
use IZal\Lshopify\Resources\CollectionResource;
use IZal\Lshopify\Resources\TagResource;
use Inertia\Inertia;

class ProductCreateController extends Controller
{
    public function __invoke(): \Inertia\Response
    {
        $data = [
            'collection' => CollectionResource::collection(Collection::all()),
            'tags' => TagResource::collection(Tag::all()),
            'variants' => Variant::defaultVariants(),
            'product_types' => CategoryResource::collection(Category::all()),
        ];

        return Inertia::render('Product/ProductCreate', $data);
    }
}
