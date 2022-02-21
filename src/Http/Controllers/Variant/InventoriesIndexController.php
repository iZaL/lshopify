<?php

namespace IZal\Lshopify\Http\Controllers\Variant;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Resources\ProductResource;
use IZal\Lshopify\Resources\VariantResource;
use Inertia\Inertia;

class InventoriesIndexController extends Controller
{
    public function __invoke(): \Inertia\Response
    {
        $variants = Variant::with(['product'])->where('default',0)->get();
        $variants = VariantResource::collection($variants);
        return Inertia::render('Product/Variant/InventoryIndex', ['variants' => $variants]);
    }
}
