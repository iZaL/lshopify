import React from 'react';
import {Product} from '../../types';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';

interface Props {
  products: Product[];
}

export default function Products({products}: Props) {
  const onProductClick = (product: Product) => {
    return Inertia.get(route('lshopify.products.edit', [product.id]));
  };

  return (
    <ul className="px-4">
      {products.map((product, i) => {
        return (
          <li
            className="cursor-pointer"
            onClick={() => onProductClick(product)}
            key={i}>
            {product.id} - {product.title}
          </li>
        );
      })}
    </ul>
  );
}
