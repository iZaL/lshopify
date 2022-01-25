import React from 'react';
import {Collection} from '../../types';
import CollectionMenuItem from './CollectionMenuItem';

interface Props {
  collection: Collection[];
  defaultCollection: Collection[];
  onChange: (item: Collection, e: boolean) => void;
}

export default function CollectionMenu({
  collection,
  defaultCollection,
  onChange,
}: Props) {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 z-30 h-[12rem] w-full overflow-y-scroll rounded-md bg-blue-50 bg-white shadow-md focus:border-none focus:outline-none">
        <ul role="button" className="font-weight-light ">
          {defaultCollection.map((item, index) => {
            return (
              <CollectionMenuItem
                key={index}
                item={item}
                checked={collection.some(collect => collect.id === item.id)}
                onChange={e => onChange(item, e)}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
