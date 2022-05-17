import {SearchIcon, XIcon} from '@heroicons/react/solid';
import React, {ReactElement, useEffect, useState} from 'react';

import Border from './Border';
import Button from './Button';
import Checkbox from './forms/Checkbox';
import InputText from './forms/InputText';
import Modal from './Modal';
import ModalFooter from './ModalFooter';

type Item = {
  id: number;
  name?: string;
  title?: string;
};

interface Props<T> {
  selectedItems: number[];
  items: T[];
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
  onConfirm: (items: number[]) => void;
  placeholder?: string;
  modalProps?: {
    title: string;
    subtitle?: string;
    onClose: () => void;
    hideFooter?: boolean;
  };
  children?: (props: {
    item: T;
    selectedItemIDs: number[];
    addRemoveItem: (item: T) => void;
  }) => JSX.Element;
  onItemsConfirm?: (items: number[]) => void;
  // footer?: (props: {selectedItems: T[], onConfirm: () => void}) => JSX.Element;
}

export default function ModalListSelection<T extends Item>({
  searchTerm,
  selectedItems,
  items,
  onConfirm,
  onSearch,
  placeholder = 'Search',
  modalProps,
  children,
  onItemsConfirm,
}: Props<T>) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedItemIDs, setSelectedItemIDs] = useState<number[]>([]);

  useEffect(() => {
    setSelectedItemIDs(selectedItems);
    // setSelectedItemIDs(selectedItems.map(({id}) => id));
  }, [showDialog]);

  const addRemoveItem = (item: T) => {
    const newItemIds = selectedItemIDs.includes(item.id)
      ? selectedItemIDs.filter(id => id !== item.id)
      : [...selectedItemIDs, item.id];
    setSelectedItemIDs(newItemIds);
  };

  const removeItemFromCollection = (item: T) => {
    onConfirm(selectedItems.filter(id => id !== item.id));
  };

  const adAddRemoveConfirm = () => {
    // onConfirm(
    //   selectedItemIDs.map(itemID =>
    //     items.find(item => item.id === itemID),
    //   ) as T[],
    // );
    onConfirm(selectedItemIDs);
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
        {selectedItems.map((item, i) => {
          const model = items.find(model => model.id === item) as T;
          return (
            <li
              key={i}
              className="flex cursor-default flex-row items-center space-x-2 space-y-2 px-4">
              <div className="flex-1">
                {model.name ? model.name : model.title}
              </div>
              <Button
                buttonStyle="p-2"
                theme="clear"
                onClick={() => removeItemFromCollection(model)}>
                <XIcon className="h-5 w-5 text-gray-500" />
              </Button>
            </li>
          );
        })}
      </ul>

      <Modal
        heading={modalProps?.title || placeholder}
        visible={showDialog}
        onClose={() => onModalClose()}
        onConfirm={() => {
          setShowDialog(false);
          adAddRemoveConfirm();
        }}
        {...modalProps}>
        <div className="relative">
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

          {children
            ? items.map((item, i) =>
                children({item, selectedItemIDs, addRemoveItem}),
              )
            : items.map(item => (
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
          {/*{*/}
          {/*  modalProps?.hideFooter && (*/}
          {/*    <ModalFooter*/}
          {/*      onHideModal={() => onModalClose()}*/}
          {/*      onProceed={() => {*/}
          {/*        onModalClose();*/}
          {/*        onItemsConfirm ? onItemsConfirm(selectedItemIDs) : undefined*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  )*/}
          {/*}*/}
        </div>
      </Modal>
    </div>
  );
}
