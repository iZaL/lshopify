import {SearchIcon, XIcon} from '@heroicons/react/solid';
import React, {useEffect, useState} from 'react';

import Border from '../../components/Border';
import Button from '../../components/Button';
import Checkbox from '../../components/forms/Checkbox';
import InputText from '../../components/forms/InputText';
import Modal from '../../components/Modal';
import {Collection, Customer, Product} from '../../types';

type Item = {
  id: number;
  name: string;
};

interface Props<T> {
  onChange: (field: keyof T | any, value: any) => void;
  selectedItems: T[];
  items: T[];
  searchTerm: string;
  sortTerm: string;
  onSearch: (searchTerm: string) => void;
  onAddItem: (customersIDs: number[]) => void;
}

export default function CustomerSelection<T extends Item>({
  onChange,
  searchTerm,
  selectedItems,
  items,
  onAddItem,
  onSearch,
}: Props<T>) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedItemIDs, setSelectedItemIDs] = useState<number[]>([]);
  console.log('sele', selectedItemIDs);

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
    const customerProductsIDs = selectedItems.map(({id}) => id);
    onAddItem(customerProductsIDs.filter(id => id !== item.id));
  };

  const adAddRemoveConfirm = () => {
    onAddItem(selectedItemIDs);
  };

  return (
    <div className="mt-6">
      {/* <Subheader text="Products" /> */}

      <div className="flex flex-row justify-around">
        <div className="flex-1">
          <InputText
            name="search"
            placeholder="Search customers"
            onChange={e => {
              onChange('searchTerm', e.target.value);
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
            <div className="w-5">{i + 1}.</div>
            {/* <VariantImage image={product.image} onClick={() => {}} /> */}
            <div className="flex-auto">
              {/* <ProductTitle product={product} /> */}
            </div>
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
        heading="Add customers"
        visible={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={() => {
          setShowDialog(false);
          adAddRemoveConfirm();
        }}>
        <div className="p-5">
          <InputText
            name="product_search"
            placeholder="Search customers"
            onChange={e => onSearch(e.target.value)}
            value={searchTerm}
            leftComponent={<SearchIcon className="h-5 w-5 text-gray-500" />}
          />
        </div>
        <Border />

        {items.map((item, i) => (
          <li
            key={i}
            className="flex flex-row items-center space-x-4 py-2 px-4 hover:bg-gray-100"
            onClick={() => addRemoveItem(item)}>
            <Checkbox
              checked={selectedItemIDs.includes(item.id)}
              name="product"
              onChange={() => {}}
            />
            {/* <VariantImage image={product.image} onClick={() => {}} /> */}
            <div className="">{item.name}</div>
          </li>
        ))}
      </Modal>
    </div>
  );
}
