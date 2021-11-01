<?php

namespace IZal\Lshopify\Http\Controllers\Product;

use IZal\Lshopify\Actions\ProductUpdateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\ProductStoreRequest;
use IZal\Lshopify\Models\Product;

class ProductUpdateController extends Controller
{
    public function __invoke(
        ProductStoreRequest $request,
        ProductUpdateAction $action,
        $id
    ): \Illuminate\Http\RedirectResponse {
        $product = Product::find($id);

        try {
            $action->update($product, collect($request->all()));
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->with('error', $e->getMessage());
        }

        return redirect()
            ->route('lshopify.products.edit', $product->id, 303)
            ->with('success', 'Saved');
    }
}
