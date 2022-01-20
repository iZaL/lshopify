import React from 'react';
import {Collection} from '../../types';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';

interface Props {
  collections: Collection[];
}

export default function CollectionList({collections}: Props) {
  const onCollectionClick = (collection: Collection) => {
    return Inertia.get(route('lshopify.collections.edit', [collection.id]));
  };

  return (
    <ul className="px-4">
      {collections.map((collection, i) => {
        return (
          <li onClick={() => onCollectionClick(collection)} key={i}>
            {collection.id} - {collection.name}
          </li>
        );
      })}
    </ul>
  );
}
