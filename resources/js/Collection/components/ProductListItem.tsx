import React from 'react';
import Checkbox from '../../components/forms/Checkbox';
import VariantImage from '../../Product/Variant/components/VariantImage';
import {Product} from '../../types';

interface Props {
  product: Product;
}

export default function ProductListItem({product}: Props) {
  return (
    <div className="flex flex-row items-center space-x-4 py-2 px-4">
      <Checkbox checked={false} name="product" onChange={() => {}} />
      <VariantImage image={product.image} onClick={() => {}} />
      <div className="">{product.title}</div>
    </div>
  );
}
