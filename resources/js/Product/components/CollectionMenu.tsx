import React from 'react';
import {Collection} from '../../types';
import CollectionMenuItem from './CollectionMenuItem';

interface Props {
  items: Collection[];
  selectedItems: Collection[];
  onChange: (item: Collection, e: boolean) => void;
}

export default function CollectionMenu({
  items,
  selectedItems,
  onChange,
}: Props) {
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 z-30 h-[12rem] w-full overflow-y-scroll rounded-md bg-blue-50 bg-white shadow-md focus:border-none focus:outline-none">
        <ul role="button" className="font-weight-light ">
          {items.map((item, index) => {
            return (
              <CollectionMenuItem
                key={index}
                item={item}
                checked={selectedItems.some(collect => collect.id === item.id)}
                onChange={e => onChange(item, e)}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
