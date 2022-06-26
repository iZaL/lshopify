<?php

namespace IZal\Lshopify\Jobs\Product;

use IZal\Lshopify\Events\ProductCreated;
use IZal\Lshopify\Jobs\ImageUploadAction;
use IZal\Lshopify\Jobs\Product\Variant\CreateVariant;
use IZal\Lshopify\Models\Category;
use IZal\Lshopify\Models\Product;

class CreateProduct
{
    /**
     * @var ImageUploadAction
     */
    private $imageUploadAction;
    private $attributes;

    public function __construct(array $attributes, ImageUploadAction $imageUploadAction)
    {
        $this->imageUploadAction = $imageUploadAction;
        $this->attributes = $attributes;
    }

    public function handle(): Product
    {
        $attributes = $this->attributes;
        $product = new Product();
        $product->fill($attributes);
        $product->save();

        $variantAttributes = $attributes['default_variant'];
        $variantAttributes['default'] = true;

        dispatch(new CreateVariant($product, $variantAttributes, true));

        // product type
        if ($attributes['category']) {
            $category = Category::find(optional($attributes['category'])['id']);
            if ($category) {
                $product->category()->associate($category);
            }
        }

        // tags
        if($attributes['tags']) {
            $product->syncTags(
                collect($attributes['tags'])
                    ->pluck('id')
                    ->toArray()
            );
        }

        // collection
        if($attributes['collections']) {
            $product->collections()->sync(
                collect($attributes['collections'])
                    ->pluck('id')
                    ->toArray()
            );
        }

        if (isset($attributes['images']) && !empty($attributes['images'])) {
            $this->imageUploadAction->uploadToServer($attributes['images'])->saveInDB([
                'imageable_id' => $product->id,
                'imageable_type' => 'product',
            ]);
        }

        event(new ProductCreated($product));
        return $product;
    }
}
