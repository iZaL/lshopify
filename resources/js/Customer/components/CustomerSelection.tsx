import {SearchIcon, XIcon} from '@heroicons/react/solid';
import React, {useEffect, useState} from 'react';

import Border from '../../components/Border';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Checkbox from '../../components/forms/Checkbox';
import InputText from '../../components/forms/InputText';
import Select from '../../components/forms/Select';
import Modal from '../../components/Modal';
import Subheader from '../../components/Subheader';
import ProductTitle from '../../Product/components/ProductTitle';
import VariantImage from '../../Product/Variant/components/VariantImage';
import { Collection, Customer, Product } from '../../types'

interface Props {
  onChange: (field: keyof Collection | any, value: any) => void;
  selectedCustomers: Customer[];
  customers: Customer[];
  searchTerm: string;
  sortTerm: string;
  onSearch: (searchTerm: string) => void;
  onAddProducts: (customersIDs: Array<number>) => void;
}

export default function CustomerSelection({
  onChange,
  searchTerm,
  selectedCustomers,
  customers,
  onAddProducts,
  onSearch,
}: Props) {
  const [showDialog, setShowDialog] = useState(false);

  const [selectedProductIDs, setSelectedProductIDs] = useState<number[]>([]);

  useEffect(() => {
    setSelectedProductIDs(selectedCustomers.map(({id}) => id));
  }, [showDialog]);

  const addRemoveProduct = (product: Product) => {
    const newProductIDs = selectedProductIDs.includes(product.id)
      ? selectedProductIDs.filter(id => id !== product.id)
      : [...selectedProductIDs, product.id];
    setSelectedProductIDs(newProductIDs);
  };

  const removeProductFromCollection = (product: Product) => {
    const customerProductsIDs = selectedCustomers.map(({id}) => id);
    onAddProducts(customerProductsIDs.filter(id => id !== product.id));
  };

  const onProductAddRemoveConfirm = () => {
    onAddProducts(selectedProductIDs);
  };

  return (
    <div className='mt-6'>
      {/*<Subheader text="Products" />*/}

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

        <div className=''>
          <Button theme="default" onClick={() => setShowDialog(true)}>
            <div className="block w-full">Browse</div>
          </Button>

        </div>


      </div>

      <ul>
        {selectedCustomers.map((product, i) => (
          <li
            key={i}
            className="flex cursor-default flex-row items-center space-x-2 space-y-2 px-4">
            <div className="w-5">{i + 1}.</div>
            {/*<VariantImage image={product.image} onClick={() => {}} />*/}
            <div className="flex-auto">
              {/*<ProductTitle product={product} />*/}
            </div>
            <Button
              buttonStyle="p-2"
              theme="clear"
              onClick={() => {}}>
              <XIcon className="h-5 w-5 text-gray-500" />
            </Button>
          </li>
        ))}
      </ul>

      <Modal
        heading="Edit customers"
        visible={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={() => {
          setShowDialog(false);
          onProductAddRemoveConfirm();
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

        {customers.map((product, i) => (
          <li
            key={i}
            className="flex flex-row items-center space-x-4 py-2 px-4 hover:bg-gray-100"
            onClick={() => {}}>
            <Checkbox
              checked={selectedProductIDs.includes(product.id)}
              name="product"
              onChange={() => {}}
            />
            {/*<VariantImage image={product.image} onClick={() => {}} />*/}
            {/*<div className="">{product.title}</div>*/}
          </li>
        ))}
      </Modal>
    </div>
  );
}
