<?php

namespace IZal\Lshopify\Http\Controllers;

use Inertia\Inertia;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Resources\VariantResource;

class InventoryController extends Controller
{
    public function index(): \Inertia\Response
    {
        $variants = Variant::with(['product', 'image'])
            ->where('default', 0)
            ->get();
        $variants = VariantResource::collection($variants);
        return Inertia::render('Product/Variant/InventoryIndex', ['variants' => $variants]);
    }
}
