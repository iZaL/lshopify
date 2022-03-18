import React, {useState} from 'react';
import Card from '../../components/Card';
import Subheader from '../../components/Subheader';
import Checkbox from '../../components/forms/Checkbox';
import Border from '../../components/Border';
import VariantOptionsItem from './Variants/VariantOptionsItem';
import {Variant, VariantOption} from '../../types';
import Button from '../../components/Button';

interface Props {
  currentVariants: VariantOption[];
  defaultVariants: VariantOption[];
  onChange: (name: keyof Variant, options: VariantOption[]) => void;
}

export default function VariantSection({currentVariants, defaultVariants, onChange}: Props) {
  const [hasVariants, setHasVariants] = useState(false);
  const pendingVariants = defaultVariants.filter(({id}) => !currentVariants.some(v => v.id === id));
  const onVariantAdd = () => {
    const variantKeys = currentVariants.map(({id}) => id);
    const randomVariant = defaultVariants.find(({id}) => !variantKeys.includes(id));
    if (randomVariant) {
      const variants = [...currentVariants, {...randomVariant, options: []}];
      onChange('options', variants);
    }
  };

  const onVariantsHideShow = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasVariants(e.target.checked);
    if (currentVariants.length === 0) {
      onVariantAdd();
    } else {
      onChange('options', []);
    }
  };

  const onVariantChange = (oldVariant: VariantOption, newVariant: VariantOption) => {
    const variants = currentVariants.filter(variant => variant.id !== oldVariant.id);
    const newVariants = [...variants, {...newVariant, options: oldVariant.options}];
    onChange('options', newVariants);
  };

  const onVariantRemove = (variant: VariantOption) => {
    const variants = currentVariants.filter(v => v.id !== variant.id);
    onChange('options', variants);
  };

  const onVariantOptionsChange = (currentVariant: VariantOption, options: VariantOption[]) => {
    const variants = currentVariants.map(variant => {
      if (variant.id === currentVariant.id) {
        return {
          ...currentVariant,
          options: options,
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
          {currentVariants.map((variant: VariantOption, index) => {
            return (
              <VariantOptionsItem
                key={index}
                iteration={index + 1}
                variant={variant}
                variants={pendingVariants}
                onVariantChange={onVariantChange}
                onVariantOptionsChange={onVariantOptionsChange}
                onVariantRemove={onVariantRemove}
                showRemoveItemButton={currentVariants.length > 1}
              />
            );
          })}

          {currentVariants.length <= 2 && (
            <Button onClick={onVariantAdd} theme="default">
              Add another option
            </Button>
          )}
        </>
      )}
    </Card>
  );
}
