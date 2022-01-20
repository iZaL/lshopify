import React from 'react';
import {Product} from '../../types';
import {Link} from '@inertiajs/inertia-react';
import route from 'ziggy-js';

interface Props {
  product: Product;
  style?: string;
}

export default function TitleSection({product, style}: Props) {
  return (
    <Link
      href={route('lshopify.products.edit', [product.id])}
      className={`text-blue-500 ${style}`}>
      {product.title}
    </Link>
  );
}
