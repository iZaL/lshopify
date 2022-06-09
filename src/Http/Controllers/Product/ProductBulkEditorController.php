<?php

namespace IZal\Lshopify\Http\Controllers\Product;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use IZal\Lshopify\Jobs\UpdateProduct;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\ProductBulkEditorUpdateRequest;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Resources\ProductResource;

class ProductBulkEditorController extends Controller
{
    /**
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request): \Inertia\Response
    {
        $productIDs = $request->product_ids;
        $products = Product::with(['images', 'variants.image', 'category', 'tags', 'collections', 'default_variant'])
            ->whereIn('id', $productIDs)
            ->get();
        $products = ProductResource::collection($products);
        $data = [
            'products' => $products,
        ];
        return Inertia::render('Product/ProductBulkEdit', $data);
    }

    /**
     * @param ProductBulkEditorUpdateRequest $request
     * @param UpdateProduct $action
     * @return RedirectResponse
     */
    public function update(ProductBulkEditorUpdateRequest $request, UpdateProduct $action): RedirectResponse
    {
        $products = $request->get('products');

        foreach ($products as $product) {
            $productModel = Product::find($product['id']);
            if ($productModel) {
                $action->run($productModel, collect($product));
            }
        }
        return redirect()
            ->back()
            ->with('success', 'Saved');
    }
}
