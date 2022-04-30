import {SearchIcon, XIcon} from '@heroicons/react/solid';
import React, {useEffect, useState} from 'react';

import Border from './Border';
import Button from './Button';
import Checkbox from './forms/Checkbox';
import InputText from './forms/InputText';
import Modal from './Modal';

type Item = {
  id: number;
  name?: string;
  title?: string;
};

interface Props<T> {
  selectedItems: T[];
  items: T[];
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
  onConfirm: (items: T[]) => void;
  placeholder?: string;
  modalProps?: {
    title: string;
    subtitle?: string;
    onClose: () => void;
  };
}

export default function ModalListSelection<T extends Item>({
  searchTerm,
  selectedItems,
  items,
  onConfirm,
  onSearch,
  placeholder = 'Search',
  modalProps,
}: Props<T>) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedItemIDs, setSelectedItemIDs] = useState<number[]>([]);

  useEffect(() => {
    setSelectedItemIDs(selectedItems.map(({id}) => id));
  }, [showDialog]);

  const addRemoveItem = (item: T) => {
    const newItemIds = selectedItemIDs.includes(item.id)
      ? selectedItemIDs.filter(id => id !== item.id)
      : [...selectedItemIDs, item.id];
    setSelectedItemIDs(newItemIds);
  };

  const removeItemFromCollection = (item: T) => {
    onConfirm(selectedItems.filter(({id}) => id !== item.id));
  };

  const adAddRemoveConfirm = () => {
    onConfirm(
      selectedItemIDs.map(itemID =>
        items.find(item => item.id === itemID),
      ) as T[],
    );
  };

  function onModalClose() {
    setShowDialog(false);
    if (modalProps?.onClose) {
      modalProps.onClose();
    }
  }

  return (
    <div className="mt-6">
      <div className="flex flex-row justify-around">
        <div className="flex-1">
          <InputText
            name="search"
            placeholder={placeholder}
            onChange={e => {
              onSearch(e.target.value);
              setShowDialog(true);
            }}
            value=""
            leftComponent={<SearchIcon className="h-5 w-5 text-gray-500" />}
          />
        </div>

        <div className="">
          <Button theme="default" onClick={() => setShowDialog(true)}>
            <div className="block w-full">Browse</div>
          </Button>
        </div>
      </div>

      <ul>
        {selectedItems.map((item, i) => (
          <li
            key={i}
            className="flex cursor-default flex-row items-center space-x-2 space-y-2 px-4">
            <div className="flex-1">{item.name ? item.name : item.title}</div>
            <Button
              buttonStyle="p-2"
              theme="clear"
              onClick={() => removeItemFromCollection(item)}>
              <XIcon className="h-5 w-5 text-gray-500" />
            </Button>
          </li>
        ))}
      </ul>

      <Modal
        heading={modalProps?.title || placeholder}
        visible={showDialog}
        onClose={() => onModalClose()}
        onConfirm={() => {
          setShowDialog(false);
          adAddRemoveConfirm();
        }}>
        <div className="p-5">
          <InputText
            name="product_search"
            placeholder={placeholder}
            onChange={e => onSearch(e.target.value)}
            value={searchTerm}
            leftComponent={<SearchIcon className="h-5 w-5 text-gray-500" />}
          />
        </div>
        <Border />

        {items.map(item => (
          <li
            key={item.id}
            className="flex flex-row items-center space-x-4 py-2 px-4 hover:bg-gray-100"
            onClick={() => addRemoveItem(item)}>
            <Checkbox
              checked={selectedItemIDs.includes(item.id)}
              onChange={() => {}}
            />
            <div className="">{item.name ? item.name : item.title}</div>
          </li>
        ))}
      </Modal>
    </div>
  );
}
