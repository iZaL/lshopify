import React from 'react';
import Card from '../../../components/Card';
import {Product, Variant} from '../../../types';
import {InertiaLink} from '@inertiajs/inertia-react';
import VariantImage from './VariantImage';
import route from 'ziggy-js';

interface Props {
  product: Product;
  variant: Variant | null;
}

export default function ProductInfo({product, variant}: Props) {
  return (
    <Card>
      <div className="flex flex-row space-x-4 items-center justify-center">
        {variant && <VariantImage image={variant.image} onClick={() => {}} />}

        <div className="flex-1 text-sm space-y-2">
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
