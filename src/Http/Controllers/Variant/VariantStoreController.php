<?php

namespace IZal\Lshopify\Http\Controllers\Variant;

use IZal\Lshopify\Actions\VariantCreateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\VariantStoreRequest;
use IZal\Lshopify\Models\Product;

class VariantStoreController extends Controller
{
    public function __invoke(
        $productID,
        VariantStoreRequest $request,
        VariantCreateAction $variantCreateAction
    ): \Illuminate\Http\RedirectResponse {
        $product = Product::find($productID);
        $imageID = null;
        if ($request->image && !$request->file('image')) {
            $imageID = $request->image['id'] ?? null;
        }

        $variantAttributes = array_merge($request->except('images', 'image'), [
            'product_id' => $product->id,
            'image_id' => $imageID,
        ]);

        $variant = $variantCreateAction->create($variantAttributes);

        return redirect()
            ->route('lshopify.products.variants.edit', [$product->id, $variant->id])
            ->with('success', 'Saved');
    }
}
