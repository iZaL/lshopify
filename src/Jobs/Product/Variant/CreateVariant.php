<?php

namespace IZal\Lshopify\Jobs\Product\Variant;

use IZal\Lshopify\Events\VariantCreated;
use IZal\Lshopify\Models\Product;
use IZal\Lshopify\Models\Variant;
use Illuminate\Support\Collection;

class CreateVariant
{
    private array $variantAttributes;
    private Product $product;
    private bool $resolveOptions;

    /**
     * @param Product $product
     * @param array $variantAttributes
     * @param bool $resolveOptions
     */
    public function __construct(Product $product, array $variantAttributes, bool $resolveOptions = false)
    {
        $this->variantAttributes = $variantAttributes;
        $this->product = $product;
        $this->resolveOptions = $resolveOptions;
    }

    public function handle(): Variant
    {
        $attributes = $this->variantAttributes;
        $attributes['product_id'] = $this->product->id;
        $variant = new Variant();
        unset($attributes['image_id']);
        $variant->fill($attributes);
        $variant->save();

        if (!empty($attributes['options'])) {
            if ($this->resolveOptions) {
                self::createVariantOptionWithValues($variant, $attributes['options']);
            }
        }
        //        $this->product->variants()->save($variant);

        event(new VariantCreated($variant));
        return $variant;
    }

    public static function createVariantOptionWithValues(Variant $variant, $options)
    {
        $variantOptions = static::resolveOptions($options);
        foreach ($variantOptions as $variantOption) {
            $newVariant = $variant->replicate(['default']);
            $newVariant->options = $variantOption;
            $newVariant->save();
        }
    }

    private static function resolveOptions(array $options): Collection
    {
        $optionValues = collect([]);
        foreach ($options as $option) {
            $values = [];
            foreach ($option['values'] as $value) {
                $values[] = [
                    'id' => $option['id'],
                    'name' => $value['name'],
                ];
            }
            $optionValues[] = $values;
        }

        /**
         * The following methods cross joins the products with its variants
         * for ex: Size (S,M) Color(Black, Brown)
         * result: [S Black, S brown, M Black, M Brown)
         */
        $firstOption = collect($optionValues->first()); // get the first item of the array

        $optionsExcludingFirst = $optionValues->slice(1)->all(); // get the rest items of array

        return $firstOption->crossJoin(...$optionsExcludingFirst);
    }
}
