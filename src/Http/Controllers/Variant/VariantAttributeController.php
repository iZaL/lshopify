<?php

namespace IZal\Lshopify\Http\Controllers\Variant;

use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\VariantAttributeUpdateRequest;
use IZal\Lshopify\Models\Product;

class VariantAttributeController extends Controller
{
    public function __invoke($productID, VariantAttributeUpdateRequest $request): \Illuminate\Http\RedirectResponse
    {
        $product = Product::find($productID);
        $product
            ->variants()
            ->whereIn('id', $request->variants)
            ->update([$request->field => $request->value]);

        return redirect()
            ->back()
            ->with('success', 'Saved');
    }
}
