import {InertiaLink} from '@inertiajs/inertia-react';
import React from 'react';
import route from 'ziggy-js';

import Card from '../../../components/Card';
import {Product, Variant} from '../../../types';

import VariantImage from './VariantImage';

interface Props {
  product: Product;
  variant: Variant | null;
}

export default function ProductInfo({product, variant}: Props) {
  return (
    <Card>
      <div className="flex flex-row items-center justify-center space-x-4">
        {variant && <VariantImage image={variant.image} onClick={() => {}} />}

        <div className="flex-1 space-y-2 text-sm">
          <div className="">{product.title}</div>
          <div className="">{product.status}</div>
          <div className="">{product.variants?.length} Variants</div>
          <InertiaLink
            className="text-blue-700 underline"
            href={route('lshopify.products.edit', [product.id])}>
            Back to product
          </InertiaLink>
        </div>
      </div>
    </Card>
  );
}
