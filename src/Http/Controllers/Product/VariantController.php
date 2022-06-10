<?php

namespace IZal\Lshopify\Http\Controllers\Product;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\VariantAttributeUpdateRequest;
use IZal\Lshopify\Http\Requests\VariantDeleteRequest;
use IZal\Lshopify\Http\Requests\VariantStoreRequest;
use IZal\Lshopify\Http\Requests\VariantUpdateRequest;
use IZal\Lshopify\Jobs\Product\Variant\CreateVariant;
use IZal\Lshopify\Jobs\Product\Variant\DeleteVariant;
use IZal\Lshopify\Jobs\Product\Variant\UpdateVariant;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Resources\ProductResource;
use IZal\Lshopify\Resources\VariantResource;

class VariantController extends Controller
{
    public function create($productID, Request $request): Response
    {
        $product = Product::with(['images', 'variants'])->find($productID);
        $product = new ProductResource($product);
        $data = [
            'product' => $product,
            'variant_options' => $product->variant_options,
        ];
        return Inertia::render('Product/Variant/VariantCreate', $data);
    }

    public function store($productID, VariantStoreRequest $request): RedirectResponse
    {
        $product = Product::find($productID);
        $imageID = null;
        if ($request->image && !$request->file('image')) {
            $imageID = $request->image['id'] ?? null;
        }

        $variantAttributes = array_merge($request->except('product_id', 'images', 'image'), [
            'image_id' => $imageID,
        ]);

        $variant = $this->dispatch(new CreateVariant($product, $variantAttributes));

        return redirect()
            ->route('lshopify.products.variants.edit', [$product->id, $variant->id])
            ->with('success', 'Saved');
    }

    public function edit($productID, $variantID): Response
    {
        $product = Product::with(['images', 'variants'])->find($productID);
        $variant = Variant::find($variantID);
        $product = new ProductResource($product);
        $data = [
            'product' => $product,
            'variant' => new VariantResource($variant),
        ];

        return Inertia::render('Product/Variant/VariantEdit', $data);
    }

    public function update(
        $variantID,
        VariantUpdateRequest $request,
        UpdateVariant $variantUpdateAction
    ): RedirectResponse {
        $variant = Variant::find($variantID);
        $imageID = null;

        if ($request->image && !$request->file('image')) {
            $imageID = $request->image['id'] ?? null;
        }

        $variant->update(
            array_merge(
                collect($request->all())
                    ->only($variant->getFillable())
                    ->toArray(),
                ['image_id' => $imageID]
            )
        );

        $options = $request->get('options');

        if (isset($options)) {
            $variantUpdateAction->updateVariantOptions($variant, $options);
        }

        return redirect()
            ->back()
            ->with('success', 'Saved');
    }

    public function attributes($productID, VariantAttributeUpdateRequest $request): RedirectResponse
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

    public function delete($productID, VariantDeleteRequest $request, DeleteVariant $action): RedirectResponse
    {
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
