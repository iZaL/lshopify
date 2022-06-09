<?php

namespace IZal\Lshopify\Jobs;

use IZal\Lshopify\Models\Variant;
use Illuminate\Support\Collection;

class VariantCreateAction
{
    /**
     * @var Variant
     */
    private $variant;

    public function __construct(Variant $variant)
    {
        $this->variant = $variant;
    }

    public function create(array $variantAttributes, $resolveOptions = false): Variant
    {
        $variant = $this->variant->create(
            collect($variantAttributes)
                ->only($this->getFillable())
                ->toArray()
        );

        if (!empty($variantAttributes['options'])) {
            if ($resolveOptions) {
                $this->createVariantOptionWithValues($variant, $variantAttributes['options']);
            } else {
                $variant->options = $variantAttributes['options'];
                $variant->save();
            }
        }

        return $variant;
    }

    public function createVariantOptionWithValues(Variant $variant, $options): self
    {
        $variantOptions = $this->resolveOptions($options);
        foreach ($variantOptions as $variantOption) {
            //            dd($variantOption);
            $newVariant = $variant->replicate(['default']);
            $newVariant->options = $variantOption;
            $newVariant->save();
        }
        return $this;
    }

    public function getFillable(): array
    {
        return $this->variant->getFillable();
    }

    private function resolveOptions(array $options): Collection
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
