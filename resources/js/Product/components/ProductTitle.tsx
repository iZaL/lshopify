import {Inertia} from '@inertiajs/inertia';
import React from 'react';
import route from 'ziggy-js';
import Button from '../../components/Button';
import {Product} from '../../types';

interface Props {
  product: Product;
  style?: string;
}

export default function TitleSection({product, style}: Props) {
  return (
    <Button
      theme="clear"
      onClick={() => Inertia.get(route('lshopify.products.edit', [product.id]))}
      buttonStyle={`text-blue-500 underline ${style}`}>
      {product.title}
    </Button>
  );
}
