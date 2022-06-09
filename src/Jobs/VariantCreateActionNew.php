<?php

namespace IZal\Lshopify\Jobs;

use IZal\Lshopify\Models\Variant;
use Illuminate\Support\Collection;
use JetBrains\PhpStorm\ArrayShape;

class VariantCreateActionNew
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
            $newVariant->options = [$variantOption];
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
        //        $variant1Option = $variantsArray[0] ?? [];

        $variant1Option = $variantsArray[0] ? $this->createVariantOption($variantsArray[0]) : [];

        $variant2Option = isset($variantsArray[1]) ? $this->createVariantOption($variantsArray[1]) : [];

        $variant2OptionValues = [];

        if (isset($variant2Option['values']) && !empty($variant2Option['values'])) {
            $variant2Array = $variant2Option['values'];

            foreach ($variant2Array as $variant2Arr) {
                $variant2OptionValues[] = [
                    'name' => $variant2Arr['name'],
                    'id' => $variant2Option['id'],
                ];
            }
        }

        $variant3Option = isset($variantsArray[2]) ? $this->createVariantOption($variantsArray[2]) : [];

        $variant3OptionValues = [];

        if (isset($variant3Option['values']) && !empty($variant3Option['values'])) {
            $variant3Array = $variant3Option['values'];

            foreach ($variant3Array as $variant3Arr) {
                $variant3OptionValues[] = [
                    'name' => $variant3Arr['id'],
                    'id' => $variant3Option['name'],
                ];
            }
        }

        $optionsArray = collect($variant1Option);
        //        dd($optionsArray);
        //        $optionsArray = collect($variant1OptionValues);

        if ($variant2OptionValues) {
            $optionsArray = $variant3OptionValues
                ? $optionsArray->crossJoin($variant2OptionValues, $variant3OptionValues)
                : $optionsArray->crossJoin($variant2OptionValues);
        } else {
            $optionsArray = collect([$variant1Option]);
        }
        return $optionsArray;
    }

    #[ArrayShape(['id' => 'int', 'name' => 'mixed', 'values' => 'mixed'])]
    private function createVariantOption($option): array {
        $id = rand(1000, 9999);

        $newOption = [
            'id' => $id,
            'name' => $option['name'],
        ];

        $values = collect($option['values'])->map(function ($value) use ($newOption) {
            return $this->createVariantOptionValue($newOption, $value);
        });

        $newOption['values'] = $values->toArray();

        return $newOption;
    }
    #[ArrayShape(['id' => 'int', 'name' => 'mixed'])]
    private function createVariantOptionValue($option, $value): array {
        $id = rand(1000, 9999);
        return [
            'id' => $id,
            'name' => $value['name'],
        ];
    }
}
