<?php

namespace IZal\Lshopify\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use IZal\Lshopify\Actions\CreateCategory;
use IZal\Lshopify\Http\Requests\CategoryStoreRequest;
use IZal\Lshopify\Models\Product;

class CategoryController extends Controller
{
    /**
     * @param CategoryStoreRequest $request
     * @param CreateCategory $createCategory
     * @return RedirectResponse
     */
    public function store(CategoryStoreRequest $request, CreateCategory $createCategory): RedirectResponse
    {
        $category = $createCategory($request->all());
        if ($request->product_id) {
            $product = Product::find($request->product_id);
            $product->category_id = $category->id;
            $product->save();
        }
        return redirect()->back();
    }
}
