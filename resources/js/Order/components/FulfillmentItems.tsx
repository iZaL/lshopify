import React from 'react';
import InputText from '../../components/forms/InputText';
import ProductTitle from '../../Product/components/ProductTitle';
import VariantImage from '../../Product/Variant/components/VariantImage';
import {VariantPivot} from '../../types';

interface Props {
  variants: VariantPivot[];
  currentVariants: VariantPivot[];
  onVariantQuantityChange: (
    trueVariant: VariantPivot,
    variant: VariantPivot,
    value: any,
  ) => void;
}

export default function FulfillmentItems({
  variants,
  onVariantQuantityChange,
  currentVariants,
}: Props) {
  if (!variants.length) {
    return null;
  }

  return (
    <div className="divide-y">
      {variants.map((variant, i) => {
        const trueVariant = currentVariants.find(({id}) => id === variant.id);

        if (trueVariant) {
          return (
            <div
              key={i}
              className="flex flex-col space-y-2 py-2 text-sm sm:flex-row sm:space-x-2 sm:space-y-0">
              <div className="flex flex-1 flex-row items-center space-x-2">
                <VariantImage
                  image={variant.image}
                  onClick={() => {}}
                  imageStyle="w-12 h-12"
                />
                <div className="flex-1 flex-shrink-0 text-blue-500">
                  {variant.product && (
                    <div className="underline">
                      <ProductTitle product={variant.product} />
                    </div>
                  )}
                  <div className="space-x-2 text-gray-500">{variant.title}</div>
                </div>
              </div>

              <InputText
                name={`quantity${variant.id}`}
                onChange={e =>
                  onVariantQuantityChange(trueVariant, variant, e.target.value)
                }
                value={variant.pivot_quantity}
                rightComponent={
                  <div className="text-sm text-gray-400">
                    of {trueVariant.pivot_quantity}
                  </div>
                }
              />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
