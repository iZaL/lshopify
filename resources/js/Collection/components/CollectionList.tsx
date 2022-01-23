import React from 'react';
import {Collection} from '../../types';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';
import Checkbox from '../../components/forms/Checkbox';
import Button from '../../components/Button';
import VariantImage from '../../Product/Variant/components/VariantImage';

interface Props {
  collections: Collection[];
}

export default function CollectionList({collections}: Props) {
  const onCollectionClick = (collection: Collection) => {
    return Inertia.get(route('lshopify.collections.edit', [collection.id]));
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
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-sm tracking-wider">
                    Product conditions
                  </th>
                </tr>
              </thead>
              <tbody>
                {collections.map((collection, id) => (
                  <tr
                    key={collection.id}
                    className={`${id % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td>
                      <div className="flex justify-center items-center w-12">
                        <Checkbox checked={false} onChange={() => {}} name="" />
                      </div>
                    </td>
                    <td className="py-2">
                      {collection.image && (
                        <VariantImage
                          onClick={() => onCollectionClick(collection)}
                          image={collection.image}
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Button
                        theme="clear"
                        onClick={() => onCollectionClick(collection)}>
                        {collection.name}
                      </Button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {collection.conditions.map((condition, id) => (
                        <div key={id}>{condition.title}</div>
                      ))}
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
