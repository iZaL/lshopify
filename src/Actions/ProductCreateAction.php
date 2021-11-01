<?php

namespace IZal\Lshopify\Actions;

use IZal\Lshopify\Models\Product;
use Illuminate\Support\Collection;

class ProductCreateAction
{
    /**
     * @var ImageUploadAction
     */
    private $imageUploadAction;
    /**
     * @var VariantCreateAction
     */
    private $variantCreateAction;
    /**
     * @var VariantUpdateAction
     */
    private $variantUpdateAction;

    public function __construct(
        ImageUploadAction $imageUploadAction,
        VariantCreateAction $variantCreateAction,
        VariantUpdateAction $variantUpdateAction
    ) {
        $this->imageUploadAction = $imageUploadAction;
        $this->variantCreateAction = $variantCreateAction;
        $this->variantUpdateAction = $variantUpdateAction;
    }

    public function create(Product $product, Collection $requestData): Product
    {
        $product = $product->create($requestData->only($product->getFillable())->toArray());

        $defaultVariantAttributes = $requestData->get('default_variant');

        $defaultVariantAttributes['default'] = true;
        $defaultVariantAttributes['product_id'] = $product->id;
        $this->variantCreateAction->create($defaultVariantAttributes, true);

        // product type
        $category = $requestData->get('product_type');
        $product->update(['category_id' => $category['id'] ?? null]);

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

        if (! empty($requestData->get('images'))) {
            $this->imageUploadAction
                ->uploadToServer($requestData->get('images'))
                ->saveInDB(['imageable_id' => $product->id, 'imageable_type' => get_class($product)]);
        }

        return $product;
    }
}
