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

    public function create(
        array $variantAttributes,
        $parseOptions = false
    ): Variant {
        $variant = $this->variant->create(
            collect($variantAttributes)
                ->only($this->getFillable())
                ->toArray()
        );

        if (
            isset($variantAttributes['options']) &&
            !empty($variantAttributes['options'])
        ) {
            if ($parseOptions) {
                $this->createVariantsWithOptions(
                    $variant,
                    $variantAttributes['options']
                );
            } else {
                $variant->options = $variantAttributes['options'];
                $variant->save();
            }
        }

        return $variant;
    }

    public function createVariantsWithOptions(
        Variant $variant,
        $variantAttributes
    ): self {
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
        $variant1 = $variantsArray[0] ?? [];
        $variant1Options = [];

        if (isset($variant1['options'])) {
            $variant1Array = $variant1['options'];

            foreach ($variant1Array as $variant1Arr) {
                $variant1Options[] = [
                    'name' => $variant1['name'],
                    'id' => $variant1Arr['id'],
                ];
            }
        }

        $variant2 = $variantsArray[1] ?? [];

        $variant2Options = [];

        if (isset($variant2['options'])) {
            $variant2Array = $variant2['options'];

            foreach ($variant2Array as $variant2Arr) {
                $variant2Options[] = [
                    'name' => $variant2['name'],
                    'id' => $variant2Arr['id'],
                ];
            }
        }

        $variant3 = $variantsArray[2] ?? [];

        $variant3Options = [];

        if (isset($variant3['options'])) {
            $variant3Array = $variant3['options'];

            foreach ($variant3Array as $variant3Arr) {
                $variant3Options[] = [
                    'name' => $variant3['name'],
                    'id' => $variant3Arr['id'],
                ];
            }
        }

        $optionsArray = collect($variant1Options);

        if ($variant2Options) {
            $optionsArray = $variant3Options
                ? $optionsArray->crossJoin($variant2Options, $variant3Options)
                : $optionsArray->crossJoin($variant2Options);
        } else {
            // If only 1 option, turn into assosiative array
            $optionsArray = [];
            foreach ($variant1Options as $option) {
                $optionsArray[] = [$option];
            }
            $optionsArray = collect($optionsArray);
        }

        return $optionsArray;
    }
}
