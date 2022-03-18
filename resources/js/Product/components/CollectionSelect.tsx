import React, {useState} from 'react';
import InputText from '../../components/forms/InputText';
import {Collection, Tag} from '../../types';
import SearchIcon from '@heroicons/react/outline/SearchIcon';
import CollectionMenu from './CollectionMenu';
import OutsideClickHandler from '../../components/OutsideClickHandler';
import Button from '../../components/Button';

interface Props {
  items: Collection[];
  selectedItems: Collection[];
  onChange: (collection: Collection[]) => void;
}

export default function CollectionSelect({
  items,
  selectedItems,
  onChange,
}: Props) {
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);

  const onCollectionChange = (collectionItem: Collection, checked: boolean) => {
    let newCollection;
    if (checked) {
      newCollection = [...selectedItems, collectionItem];
    } else {
      newCollection = selectedItems.filter(item => item.id !== collectionItem.id);
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
          <CollectionMenu
            selectedItems={selectedItems}
            items={items}
            onChange={onCollectionChange}
          />
        </OutsideClickHandler>
      )}

      <div className="mt-4 ">
        <ul className="space-y-2">
          {selectedItems.map((item, index) => {
            return (
              <li className="flex flex-row justify-between " key={index}>
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
            );
          })}
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
