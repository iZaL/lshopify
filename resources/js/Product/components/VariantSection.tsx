import React, {useState} from 'react';

import Border from '../../components/Border';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Checkbox from '../../components/forms/Checkbox';
import Subheader from '../../components/Subheader';
import {Variant, VariantOption, VariantValue} from '../../types';

import VariantOptionsItem from './Variants/VariantOptionsItem';

interface Props {
  currentVariantOptions: VariantOption[];
  defaultVariantOptions: VariantOption[];
  onChange: (name: keyof Variant, options: VariantOption[]) => void;
}

export default function VariantSection({
  currentVariantOptions,
  defaultVariantOptions,
  onChange,
}: Props) {
  const [hasVariants, setHasVariants] = useState(false);
  const pendingVariants = defaultVariantOptions.filter(
    ({name}) => !currentVariantOptions.some(v => v.name === name),
  );
  const onVariantAdd = () => {
    const variantKeys = currentVariantOptions.map(({name}) => name);
    const randomVariant = defaultVariantOptions.find(
      ({name}) => !variantKeys.includes(name),
    );
    if (randomVariant) {
      const variants = [
        ...currentVariantOptions,
        {...randomVariant, values: []},
      ];
      onChange('options', variants);
    }
  };

  const onVariantsHideShow = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasVariants(e.target.checked);
    if (currentVariantOptions.length === 0) {
      onVariantAdd();
    } else {
      onChange('options', []);
    }
  };

  const onVariantOptionChange = (
    oldVariant: VariantOption,
    newVariant: VariantOption,
  ) => {
    const variants = currentVariantOptions.filter(
      variant => variant.name !== oldVariant.name,
    );
    const newVariants = [
      ...variants,
      {...newVariant, values: oldVariant.values},
    ];
    onChange('options', newVariants);
  };

  const onVariantRemove = (variant: VariantOption) => {
    const variants = currentVariantOptions.filter(v => v.name !== variant.name);
    onChange('options', variants);
  };

  const onVariantValuesChange = (
    currentVariantOption: VariantOption,
    values: VariantValue[],
  ) => {
    const variants = currentVariantOptions.map(variant => {
      if (variant.name === currentVariantOption.name) {
        return {
          ...currentVariantOption,
          values,
        };
      }
      return variant;
    });
    onChange('options', variants);
  };

  return (
    <Card>
      <Subheader text="Variants" />
      <Checkbox
        name="variant"
        label="This product has multiple options, like different sizes or colors"
        checked={hasVariants}
        onChange={onVariantsHideShow}
      />

      {hasVariants && (
        <>
          <Border />
          <Subheader text="OPTIONS" headerStyle="text-sm" />
          {currentVariantOptions.map((variant: VariantOption, index) => (
            <VariantOptionsItem
              key={index}
              iteration={index + 1}
              variantOption={variant}
              pendingVariantOptions={pendingVariants}
              onVariantOptionChange={onVariantOptionChange}
              onVariantValuesChange={onVariantValuesChange}
              onVariantOptionRemove={onVariantRemove}
              showRemoveOptionButton={currentVariantOptions.length > 1}
            />
          ))}

          {currentVariantOptions.length <= 4 && (
            <Button onClick={onVariantAdd} theme="default">
              Add another option
            </Button>
          )}
        </>
      )}
    </Card>
  );
}
