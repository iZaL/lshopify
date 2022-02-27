import React from 'react';
import {VariantPivot} from '../../types';
import VariantImage from '../../Product/Variant/components/VariantImage';
import ProductTitle from '../../Product/components/ProductTitle';

interface Props {
  variants: VariantPivot[];
  onItemClick: (item: any) => void;
}

export default function OrderItems({variants}: Props) {
  if (!variants.length) {
    return null;
  }

  console.log('v', variants);
  return (
    <div className="divide-y">
      {variants.map((variant, i) => (
        <div
          className="variants-center flex flex-row items-center space-x-2 py-2 text-sm "
          key={i}>
          <VariantImage
            image={variant.image}
            onClick={() => {}}
            imageStyle="w-12 h-12"
          />
          <div className="flex-1 text-blue-500">
            {variant.product && (
              <div className="underline">
                <ProductTitle product={variant.product} />
              </div>
            )}
            <div className="space-x-2 text-gray-500 dark:text-gray-100">
              {variant.title}
            </div>
          </div>

          <div>
            OMR {variant.pivot_price} x {variant.pivot_quantity}
          </div>
          <div className="pl-6">OMR {variant.pivot_total}</div>
        </div>
      ))}
    </div>
  );
}
