<?php

namespace IZal\Lshopify\Http\Controllers\Product;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Product;

class ProductDeleteController extends Controller
{
    public function __invoke($id): \Illuminate\Http\RedirectResponse
    {
        $product = Product::find($id);

        $product->delete();

        return redirect()->back();
    }
}
