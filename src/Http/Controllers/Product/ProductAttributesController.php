<?php

namespace IZal\Lshopify\Http\Controllers\Product;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Resources\ProductResource;
use Inertia\Inertia;

class ProductAttributesController extends Controller
{
    public function __invoke(Request $request)
    {

        $this->validate($request, [
            'product_ids' => 'required|array',
        ]);


        $products = Product::whereIn('id',$request->product_ids);

        $attributes = $request->except('product_ids');

        $products->update($attributes);

        return redirect()->route('lshopify.products.index')->with('success', 'Product attributes updated');
    }
}
