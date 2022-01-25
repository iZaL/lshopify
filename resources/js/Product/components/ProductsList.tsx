import React from 'react';
import {Product} from '../../types';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';
import VariantImage from '../Variant/components/VariantImage';
import Checkbox from '../../components/forms/Checkbox';
import Button from '../../components/Button';

interface Props {
  products: Product[];
}

export default function ProductsList({products}: Props) {
  const onProductClick = (product: Product) => {
    return Inertia.get(route('lshopify.products.edit', [product.id]));
  };

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm tracking-wider"></th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm tracking-wider"></th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm tracking-wider">
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm tracking-wider">
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm tracking-wider">
                    Inventory
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm tracking-wider">
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm tracking-wider">
                    Vendor
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, id) => (
                  <tr
                    key={product.id}
                    className={`${id % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td>
                      <div className="flex w-12 items-center justify-center">
                        <Checkbox checked={false} onChange={() => {}} name="" />
                      </div>
                    </td>
                    <td className="py-2">
                      {product.image && (
                        <VariantImage
                          onClick={() => onProductClick(product)}
                          image={product.image}
                        />
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      <Button
                        theme="clear"
                        onClick={() => onProductClick(product)}>
                        {product.title}
                      </Button>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {product.status}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      4 in stocks for 5 variants
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {product.product_type}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      zalsstores
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
