<?php

namespace IZal\Lshopify\Actions;

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

    public function create(array $variantAttributes, $parseOptions = false): Variant
    {
        $variant = $this->variant->create(
            collect($variantAttributes)
                ->only($this->getFillable())
                ->toArray()
        );

        if (isset($variantAttributes['options']) && !empty($variantAttributes['options'])) {
            if ($parseOptions) {
                $this->createVariantOptionWithValues($variant, $variantAttributes['options']);
            } else {
                $variant->options = $variantAttributes['options'];
                $variant->save();
            }
        }

        return $variant;
    }

    public function createVariantOptionWithValues(Variant $variant, $variantAttributes): self
    {
        $variantOptions = $this->prepareOptions($variantAttributes);
        foreach ($variantOptions as $variantOption) {
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

    private function prepareOptions(array $variantsArray): Collection
    {
        $variant1Option = $variantsArray[0] ?? [];
        $variant1OptionValues = [];

        if (isset($variant1Option['values']) && !empty($variant1Option['values'])) {
            $variant1Array = $variant1Option['values'];

            foreach ($variant1Array as $variant1Arr) {
                $variant1OptionValues[] = [
                    'id' => $variant1Option['id'],
                    'name' => $variant1Arr['name'],
                ];
            }
        }

        $variant2Option = $variantsArray[1] ?? [];

        $variant2OptionValues = [];

        if (isset($variant2Option['values']) && !empty($variant2Option['values'])) {
            $variant2Array = $variant2Option['values'];

            foreach ($variant2Array as $variant2Arr) {
                $variant2OptionValues[] = [
                    'id' => $variant2Option['id'],
                    'name' => $variant2Arr['name'],
                ];
            }
        }

        $variant3Option = $variantsArray[2] ?? [];

        $variant3OptionValues = [];

        if (isset($variant3Option['values']) && !empty($variant3Option['values'])) {
            $variant3Array = $variant3Option['values'];

            foreach ($variant3Array as $variant3Arr) {
                $variant3OptionValues[] = [
                    'id' => $variant3Option['id'],
                    'name' => $variant3Arr['name'],
                ];
            }
        }

        $optionsArray = collect($variant1OptionValues);

        if ($variant2OptionValues) {
            $optionsArray = $variant3OptionValues
                ? $optionsArray->crossJoin($variant2OptionValues, $variant3OptionValues)
                : $optionsArray->crossJoin($variant2OptionValues);

        } else {
            // If only 1 option, turn into assosiative array
            $optionsArray = [];
            foreach ($variant1OptionValues as $option) {
                $optionsArray[] = [$option];
            }
            $optionsArray = collect($optionsArray);
        }

        return $optionsArray;
    }
}
