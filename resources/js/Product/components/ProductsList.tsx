import React from 'react';
import {Product} from '../../types';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';
import VariantImage from '../Variant/components/VariantImage';
import Checkbox from '../../components/forms/Checkbox';
import Button from '../../components/Button';
import Table from '../../components/Table';

interface Props {
  products: Product[];
}

export default function ProductsList({products}: Props) {
  const onProductClick = (product: Product) => {
    return Inertia.get(route('lshopify.products.edit', [product.id]));
  };

  return (
    <Table>
      <thead>
        <Table.Row>
          <Table.Head />
          <Table.Head />
          <Table.Head title="Product" />
          <Table.Head title="Status" />
          <Table.Head title="Inventory" />
          <Table.Head title="Type" />
          <Table.Head title="Vendor" />
        </Table.Row>
      </thead>
      <tbody>
        {products.map((product, id) => (
          <Table.Row key={id} idx={id} onClick={() => {}}>
            <Table.Col>
              <div className="flex w-12 items-center justify-center">
                <Checkbox checked={false} onChange={() => {}} name="" />
              </div>
            </Table.Col>
            <Table.Col>
              {product.image && (
                <VariantImage
                  onClick={() => onProductClick(product)}
                  image={product.image}
                />
              )}
            </Table.Col>
            <Table.Col>
              <Button theme="clear" onClick={() => onProductClick(product)}>
                {product.title}
              </Button>
            </Table.Col>
            <Table.Col>{product.status}</Table.Col>
            <Table.Col>4 in stocks for 5 variants</Table.Col>
            <Table.Col>{product.product_type}</Table.Col>
            <Table.Col>zalsstores</Table.Col>
          </Table.Row>
        ))}
      </tbody>
    </Table>
  );
}
