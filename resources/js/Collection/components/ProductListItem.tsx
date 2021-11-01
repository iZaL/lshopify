import React from 'react';
import {Product} from '../../types';
import VariantImage from '../../Product/Variant/components/VariantImage';
import Checkbox from '../../components/forms/Checkbox';

interface Props {
  product: Product;
}

export default function ProductListItem({product}: Props) {
  console.log('product', product);
  return (
    <div className='flex flex-row items-center py-2 px-4 space-x-4'>
      <Checkbox checked={false} name='product' onChange={() => {}} />
      <VariantImage image={product.image} onClick={() => {}} />
      <div className=''>{product.title}</div>
    </div>
  );
}
