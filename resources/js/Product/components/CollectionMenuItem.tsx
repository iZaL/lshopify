import React from 'react';
import Checkbox from '../../components/forms/Checkbox';
import {Collection} from '../../types';

interface Props {
  item: Collection;
  checked: boolean;
  onChange: (e: boolean) => void;
}

export default function CollectionMenuItem({item, checked, onChange}: Props) {
  return (
    <li
      className='flex flex-row px-4 py-2 hover:bg-gray-50'
      onClick={() => onChange(!checked)}
    >
      <Checkbox
        name={item.name}
        checked={checked}
        onChange={() => onChange(!checked)}
        style='text-sm font-weight-light'
      />
      <div className='px-2'>{item.name}</div>
    </li>
  );
}
