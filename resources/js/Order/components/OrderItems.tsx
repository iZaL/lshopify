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

  return (
    <div className="divide-y">
      {variants.map((variant, i) => (
        <div className="variants-center flex flex-row items-center space-x-2 py-2 text-sm " key={i}>
          <VariantImage image={variant.image} onClick={() => {}} imageStyle="w-12 h-12" />
          <div className="flex-1 text-gray-500">
            {variant.product && (
              <div className="underline">
                <ProductTitle product={variant.product} />
              </div>
            )}
            <div>{variant.title}</div>
            <div>{variant.sku && `SKU: ${variant.sku}`}</div>
          </div>

          <div className="inline-flex space-x-6 text-gray-600">
            <div>
              OMR {variant.pivot_price} x {variant.pivot_quantity}
            </div>
            <div>OMR {variant.pivot_total}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
