import React from 'react'
import { VariantPivot } from '../../types'
import VariantImage from '../../Product/Variant/components/VariantImage'
import ProductTitle from '../../Product/components/ProductTitle'

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
        <div
          className="py-2 flex flex-row variants-center space-x-2 items-center text-sm "
          key={i}>
          <VariantImage
            image={variant.image}
            onClick={() => {}}
            style="w-12 h-12"
          />
          <div className="text-blue-500 flex-1">
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
