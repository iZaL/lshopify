import React, {useEffect, useState} from 'react';
import Card from '../../components/Card';
import InputText from '../../components/forms/InputText';
import {Collection, Product} from '../../types';
import Subheader from '../../components/Subheader';
import {SearchIcon, XIcon} from '@heroicons/react/solid';
import Select from '../../components/forms/Select';
import Modal from '../../components/Modal';
import Border from '../../components/Border';
import Checkbox from '../../components/forms/Checkbox';
import VariantImage from '../../Product/Variant/components/VariantImage';
import ProductTitle from '../../Product/components/ProductTitle';
import Button from '../../components/Button';

interface Props {
  onChange: (field: keyof Collection | any, value: any) => void;
  collectionProducts: Product[];
  products: Product[];
  searchTerm: string;
  sortTerm: string;
  onAddProducts: (productIDs: Array<number>) => void;
}

export default function ProductAddSection({
  onChange,
  searchTerm,
  collectionProducts,
  products,
  onAddProducts,
}: Props) {
  const [showDialog, setShowDialog] = useState(false);

  const [selectedProductIDs, setSelectedProductIDs] = useState<number[]>([]);

  useEffect(() => {
    setSelectedProductIDs(collectionProducts.map(({id}) => id));
  }, [showDialog]);

  const addRemoveProduct = (product: Product) => {
    const newProductIDs = selectedProductIDs.includes(product.id)
      ? selectedProductIDs.filter(id => id !== product.id)
      : [...selectedProductIDs, product.id];
    setSelectedProductIDs(newProductIDs);
  };

  const removeProductFromCollection = (product: Product) => {
    const collectionProductsIDs = collectionProducts.map(({id}) => id);
    onAddProducts(collectionProductsIDs.filter(id => id !== product.id));
  };

  const onProductAddRemoveConfirm = () => {
    onAddProducts(selectedProductIDs);
  };

  return (
    <Card>
      <Subheader text="Products" />

      <div className="mx-auto grid grid-cols-1 grid-flow-col-dense grid-cols-5 gap-5 text-sm">
        <div className="col-start-1 col-span-3 space-y-2">
          <InputText
            name="search"
            placeholder="Search products"
            onChange={e => {
              onChange('searchTerm', e.target.value);
              setShowDialog(true);
            }}
            value=""
            leftComponent={<SearchIcon className="w-5 h-5 text-gray-500" />}
          />
        </div>

        <Button theme="default" onClick={() => setShowDialog(true)}>
          <div className="block w-full">Browse</div>
        </Button>

        <Select name="sort" onChange={() => {}}>
          <option value="">Best selling</option>
          <option value="">Product title A-Z</option>
        </Select>
      </div>

      <ul>
        {collectionProducts.map((product, i) => (
          <li
            key={i}
            className="flex flex-row items-center px-4 space-x-2 space-y-2 cursor-default">
            <div className="w-5">{i + 1}.</div>
            <VariantImage image={product.image} onClick={() => {}} />
            <div className="flex-auto">
              <ProductTitle product={product} />
            </div>
            <Button
              style="p-2"
              theme="clear"
              onClick={() => removeProductFromCollection(product)}>
              <XIcon className="w-5 h-5 text-gray-500" />
            </Button>
          </li>
        ))}
      </ul>

      <Modal
        heading="Edit products"
        visible={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={() => {
          setShowDialog(false);
          onProductAddRemoveConfirm();
        }}>
        <div className="p-5">
          <InputText
            name="product_search"
            placeholder={'Search products'}
            onChange={e => onChange('searchTerm', e.target.value)}
            value={searchTerm}
            leftComponent={<SearchIcon className="w-5 h-5 text-gray-500" />}
          />
        </div>
        <Border />

        {products.map((product, i) => {
          return (
            <li
              key={i}
              className="flex flex-row items-center py-2 px-4 space-x-4 hover:bg-gray-100"
              onClick={() => addRemoveProduct(product)}>
              <Checkbox
                checked={selectedProductIDs.includes(product.id)}
                name="product"
                onChange={() => {}}
              />
              <VariantImage image={product.image} onClick={() => {}} />
              <div className="">{product.title}</div>
            </li>
          );
        })}
      </Modal>
    </Card>
  );
}
