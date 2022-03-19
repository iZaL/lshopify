<?php

namespace IZal\Lshopify\Actions;

use IZal\Lshopify\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;

class ProductUpdateAction
{
    /**
     * @var VariantCreateAction
     */
    private $variantCreateAction;
    /**
     * @var VariantUpdateAction
     */
    private $variantUpdateAction;

    public function __construct(VariantCreateAction $variantCreateAction, VariantUpdateAction $variantUpdateAction)
    {
        $this->variantCreateAction = $variantCreateAction;
        $this->variantUpdateAction = $variantUpdateAction;
    }

    public function update(Product $product, Collection $requestData)
    {
        $productData = $requestData->only($product->getFillable());
        tap($product)->update($productData->toArray());

        // product type
        $category = $requestData->get('category');
        $product->update(['category_id' => $category['id'] ?? null]);

        // Vendor
        $vendor = $requestData->get('vendor');
        $product->update(['vendor_id' => $vendor['id'] ?? null]);

        // tags
        $product->syncTags(
            collect($requestData->get('tags'))
                ->pluck('id')
                ->toArray()
        );

        // collection
        $product->collections()->sync(
            collect($requestData->get('collections'))
                ->pluck('id')
                ->toArray()
        );

        // update default variant
        $defaultVariantAttributes = $requestData->get('default_variant');
        $defaultVariant = $product->default_variant;

        if ($defaultVariant) {
            $defaultVariant->update(
                collect($defaultVariantAttributes)
                    ->only($defaultVariant->getFillable())
                    ->toArray()
            );

            if (isset($defaultVariantAttributes['options']) && !empty($defaultVariantAttributes['options'])) {
                $this->variantCreateAction->createVariantsWithOptions(
                    $defaultVariant,
                    $defaultVariantAttributes['options']
                );
            }
        }

        if (!empty($requestData->get('variants'))) {
            foreach ($requestData->get('variants') as $variantAttribute) {
                $variant = $product->variants()->find($variantAttribute['id']);
                if ($variant) {
                    if (isset($variantAttribute['image']) && !($variantAttribute['image'] instanceof UploadedFile)) {
                        $variantAttribute['image_id'] = $variantAttribute['image']['id'] ?? null;
                    }
                    $variant->update(
                        collect($variantAttribute)
                            ->only($variant->getFillable())
                            ->toArray()
                    );
                    if (isset($variantAttribute['options'])) {
                        $this->variantUpdateAction->updateVariantOptions($variant, $variantAttribute['options']);
                    }
                }
            }
        }

        return tap($product);
    }
}
