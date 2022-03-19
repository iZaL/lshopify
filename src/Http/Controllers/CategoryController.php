<?php

namespace IZal\Lshopify\Http\Controllers;

use IZal\Lshopify\Actions\CategoryCreateAction;
use IZal\Lshopify\Http\Requests\CategoryStoreRequest;
use IZal\Lshopify\Models\Product;

class CategoryController extends Controller
{
    public function store(
        CategoryStoreRequest $request,
        CategoryCreateAction $action
    ): \Illuminate\Http\RedirectResponse {
        $category = $action->create($request->all());

        if ($request->product_id) {
            $product = Product::find($request->product_id);
            $product->category_id = $category->id;
            $product->save();
        }

        return redirect()->back();
    }
}
