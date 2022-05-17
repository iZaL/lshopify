import React from 'react';

import {Variant} from '../../../types';
import ProductTitle from '../../components/ProductTitle';

import VariantImage from './VariantImage';

interface Props {
  variant: Variant;
}

export default function VariantInfo({variant}: Props) {
  return (
    <div className="flex-1 space-x-2">
      <div className="flex flex-row items-center">
        <VariantImage
          image={variant.image || variant.product?.image}
          onClick={() => {}}
          imageStyle="w-12 h-12"
        />
        <div className="text-sm">
          {variant.product && (
            <div className="underline">
              <ProductTitle product={variant.product} />
            </div>
          )}
          <div className="">{variant.title}</div>
        </div>
      </div>
    </div>
  );
}
