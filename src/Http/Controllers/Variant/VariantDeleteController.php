<?php

namespace IZal\Lshopify\Http\Controllers\Variant;

use IZal\Lshopify\Actions\VariantDeleteAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\VariantDeleteRequest;
use IZal\Lshopify\Models\Product;

class VariantDeleteController extends Controller
{
    public function __invoke(
        $productID,
        VariantDeleteRequest $request,
        VariantDeleteAction $action
    ): \Illuminate\Http\RedirectResponse {
        $product = Product::find($productID);
        $product
            ->variants()
            ->whereIn('id', $request->variants)
            ->delete();

        return redirect()
            ->back()
            ->with('success', 'Deleted');
    }
}
