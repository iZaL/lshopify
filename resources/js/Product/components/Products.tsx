import React from 'react';
import {Product} from '../../types';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';
import VariantImage from '../Variant/components/VariantImage';
import Checkbox from '../../components/forms/Checkbox';

interface Props {
  products: Product[];
}

export default function Products({products}: Props) {
  const onProductClick = (product: Product) => {
    return Inertia.get(route('lshopify.products.edit', [product.id]));
  };

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
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
                      <div className="flex justify-center items-center w-12">
                        <Checkbox checked={true} onChange={() => {}} name="" />
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <a href="#" onClick={() => onProductClick(product)}>
                        {product.title}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      4 in stocks for 5 variants
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.product_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
  // return (
  //   <ul className="px-4">
  //     {products.map((product, i) => {
  //       return (
  //         <li
  //           className="cursor-pointer"
  //           onClick={() => onProductClick(product)}
  //           key={i}>
  //           {product.id} - {product.title}
  //         </li>
  //       );
  //     })}
  //   </ul>
  // );
}
