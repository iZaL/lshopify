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
      <div className="z-30 bg-blue-50 h-[12rem] overflow-y-scroll absolute top-0 left-0 w-full rounded-md shadow-md bg-white focus:outline-none focus:border-none">
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
