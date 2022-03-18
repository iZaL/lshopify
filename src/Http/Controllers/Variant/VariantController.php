<?php

namespace IZal\Lshopify\Http\Controllers\Variant;

use Illuminate\Http\Request;
use Inertia\Inertia;
use IZal\Lshopify\Actions\VariantCreateAction;
use IZal\Lshopify\Actions\VariantDeleteAction;
use IZal\Lshopify\Actions\VariantUpdateAction;
use IZal\Lshopify\Http\Controllers\Controller;
use IZal\Lshopify\Http\Requests\VariantAttributeUpdateRequest;
use IZal\Lshopify\Http\Requests\VariantDeleteRequest;
use IZal\Lshopify\Http\Requests\VariantStoreRequest;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Variant;
use IZal\Lshopify\Resources\ProductResource;
use IZal\Lshopify\Resources\VariantResource;

class VariantController extends Controller
{

    public function create($productID, Request $request): \Inertia\Response
    {
        $product = Product::with(['images', 'variants'])->find($productID);
        $product = new ProductResource($product);
        $data = [
            'product' => $product,
            'variant_options' => $product->variant_options,
        ];
        return Inertia::render('Product/Variant/VariantCreate', $data);
    }

    public function edit($productID, $variantID): \Inertia\Response
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


    public function store(
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

    public function update(
        $variantID,
        VariantStoreRequest $request,
        VariantUpdateAction $variantUpdateAction
    ): \Illuminate\Http\RedirectResponse {
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


    public function attributes($productID, VariantAttributeUpdateRequest $request): \Illuminate\Http\RedirectResponse
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

    public function delete(
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
