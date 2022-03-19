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

    public function __construct(ImageUploadAction $imageUploadAction, VariantCreateAction $variantCreateAction)
    {
        $this->imageUploadAction = $imageUploadAction;
        $this->variantCreateAction = $variantCreateAction;
    }

    public function create(Product $product, Collection $requestData): Product
    {
        $product = $product->create($requestData->only($product->getFillable())->toArray());

        $defaultVariantAttributes = $requestData->get('default_variant');
        $defaultVariantAttributes['default'] = true;
        $defaultVariantAttributes['product_id'] = $product->id;
        $this->variantCreateAction->create($defaultVariantAttributes, true);

        // product type
        $category = $requestData->get('category');
        $product->update(['category_id' => $category['id'] ?? null]);

        //        $vendor = $requestData->get('vendor');
        //        $product->update(['vendor_id' => $vendor['id'] ?? null]);

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

        if (!empty($requestData->get('images'))) {
            $this->imageUploadAction->uploadToServer($requestData->get('images'))->saveInDB([
                'imageable_id' => $product->id,
                'imageable_type' => 'product',
            ]);
        }

        return $product;
    }
}
