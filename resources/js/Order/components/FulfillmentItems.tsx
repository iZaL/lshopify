import React from 'react';
import {VariantPivot} from '../../types';
import VariantImage from '../../Product/Variant/components/VariantImage';
import ProductTitle from '../../Product/components/ProductTitle';
import InputText from '../../components/forms/InputText';

interface Props {
  variants: VariantPivot[];
  currentVariants: VariantPivot[];
  onVariantQuantityChange: (trueVariant:VariantPivot, variant: VariantPivot, value: any) => void;
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
    <div className='divide-y dark:divide-gray-500'>
      {variants.map((variant, i) => {
        const trueVariant = currentVariants.find(({id}) => id === variant.id);

        if(trueVariant) {
          return (
            <div
              key={i}
              className='py-2 flex flex-col sm:flex-row sm:space-x-2 text-sm space-y-2 sm:space-y-0'
            >
              <div className='flex flex-row items-center flex-1 space-x-2'>
                <VariantImage
                  image={variant.image}
                  onClick={() => {}}
                  style='w-12 h-12'
                />
                <div className='text-blue-500 flex-1 flex-shrink-0'>
                  {variant.product && (
                    <div className='underline'>
                      <ProductTitle product={variant.product} />
                    </div>
                  )}
                  <div className='space-x-2 text-gray-500 dark:text-gray-100'>
                    {variant.title}
                  </div>
                </div>
              </div>

              <InputText
                name={`quantity${variant.id}`}
                onChange={(e) => onVariantQuantityChange(trueVariant, variant, e.target.value)}
                value={variant.pivot_quantity}
                rightComponent={
                  <div className='text-gray-400 text-sm'>
                    of {trueVariant?.pivot_quantity}
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
