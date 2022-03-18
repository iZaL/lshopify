<?php

namespace IZal\Lshopify\Http\Controllers\Product;

use Illuminate\Http\Request;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Product;

class ProductDeleteController extends Controller
{
    public function __invoke(Request $request): \Illuminate\Http\RedirectResponse
    {
        $this->validate($request, [
            'product_ids' => 'required|array',
        ]);

        $products = Product::whereIn('id', $request->product_ids);

        $products->delete();

        return redirect()
            ->back()
            ->with('success', 'Products Deleted');
    }
}
