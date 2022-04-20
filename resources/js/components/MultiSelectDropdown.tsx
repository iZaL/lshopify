import SearchIcon from '@heroicons/react/outline/SearchIcon';
import React, {useState} from 'react';

import Button from './Button';
import Checkbox from './forms/Checkbox';
import InputText from './forms/InputText';
import OutsideClickHandler from './OutsideClickHandler';

type Item = {
  id: number | string;
  name: string;
};

interface Props<T> {
  items: T[];
  selectedItems: T[];
  onChange: (collection: T[]) => void;
}

export default function MultiSelectDropdown<T extends Item>({
  items,
  selectedItems,
  onChange,
}: Props<T>) {
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);

  const onCollectionChange = (collectionItem: T, checked: boolean) => {
    let newCollection;
    if (checked) {
      newCollection = [...selectedItems, collectionItem];
    } else {
      newCollection = selectedItems.filter(
        item => item.id !== collectionItem.id,
      );
    }
    onChange(newCollection);
  };

  return (
    <div className="text-sm">
      <div onClick={() => setShowCollectionMenu(!showCollectionMenu)}>
        <InputText
          name="collection"
          leftComponent={<SearchIcon className="h-5 w-5 text-gray-400" />}
          placeholder="Search for collection"
          onChange={() => {}}
        />
      </div>
      {showCollectionMenu && (
        <OutsideClickHandler
          onOutsideClick={() => setShowCollectionMenu(false)}>
          <div className="relative">
            <div className="absolute top-0 left-0 z-30 h-[12rem] w-full overflow-y-scroll rounded-md bg-blue-50 bg-white shadow-md focus:border-none focus:outline-none">
              <ul role="button" className="font-weight-light">
                {items.map((item, idx) => {
                  const checked = selectedItems.some(
                    collect => collect.id === item.id,
                  );
                  return (
                    <li
                      key={idx}
                      className="flex flex-row px-4 py-2 hover:bg-gray-50"
                      onClick={() => onCollectionChange(item, !checked)}>
                      <Checkbox
                        name={item.name}
                        checked={checked}
                        onChange={e =>
                          onCollectionChange(item, e.target.checked)
                        }
                        inputStyle="text-sm font-weight-light"
                      />
                      <div className="px-2">{item.name}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </OutsideClickHandler>
      )}

      <div className="mt-4">
        <ul className="space-y-2">
          {selectedItems.map((item, index) => (
            <li className="flex flex-row justify-between" key={index}>
              <Button
                theme="clear"
                buttonStyle="text-sm text-blue-500 underline">
                {item.name}
              </Button>

              <Button
                theme="clear"
                onClick={() => onCollectionChange(item, false)}>
                X
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {!selectedItems.length && (
        <div className="block text-sm text-gray-500">
          Add this product to a collection so it’s easy to find in your store.
        </div>
      )}
    </div>
  );
}
