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

    public function create(array $variantAttributes, $resolveOptions = false): Variant
    {
        $variant = $this->variant->create(
            collect($variantAttributes)
                ->only($this->getFillable())
                ->toArray()
        );

        if (isset($variantAttributes['options']) && !empty($variantAttributes['options'])) {
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
        $option1 = $options[0] ?? [];
        $option1Values = [];
        if (isset($option1['values']) && !empty($option1['values'])) {
            foreach ($option1['values'] as $value) {
                $option1Values[] = [
                    'id' => $option1['id'],
                    'name' => $value['name'],
                ];
            }
        }

        $option2 = $options[1] ?? [];
        $option2Values = [];
        if (isset($option2['values']) && !empty($option2['values'])) {
            foreach ($option2['values'] as $value) {
                $option2Values[] = [
                    'id' => $option2['id'],
                    'name' => $value['name'],
                ];
            }
        }

        $option3 = $options[2] ?? [];
        $option3Values = [];
        if (isset($option3['values']) && !empty($option3['values'])) {
            foreach ($option3['values'] as $value) {
                $option3Values[] = [
                    'id' => $option3['id'],
                    'name' => $value['name'],
                ];
            }
        }

        $optionsMatrix = collect($option1Values);

        if ($option2Values) {
            $optionsMatrix = $option3Values
                ? $optionsMatrix->crossJoin($option2Values, $option3Values)
                : $optionsMatrix->crossJoin($option2Values);

        } else {
            // If only 1 option, turn into assosiative array
            $optionsMatrix = [];
            foreach ($option1Values as $option) {
                $optionsMatrix[] = [$option];
            }
            $optionsMatrix = collect($optionsMatrix);
        }

        return $optionsMatrix;
    }
}
