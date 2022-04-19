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
import {Collection, Product} from '../../types';

interface Props {
  onChange: (field: keyof Collection | any, value: any) => void;
  collectionProducts: Product[];
  products: Product[];
  searchTerm: string;
  sortTerm: string;
  onSearch: (searchTerm: string) => void;
  onAddProducts: (productIDs: Array<number>) => void;
}

export default function ProductAddSection({
  onChange,
  searchTerm,
  collectionProducts,
  products,
  onAddProducts,
  onSearch,
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

      <div className="mx-auto grid grid-flow-col-dense grid-cols-1 grid-cols-5 gap-5 text-sm">
        <div className="col-span-3 col-start-1 space-y-2">
          <InputText
            name="search"
            placeholder="Search products"
            onChange={e => {
              onChange('searchTerm', e.target.value);
              setShowDialog(true);
            }}
            value=""
            leftComponent={<SearchIcon className="h-5 w-5 text-gray-500" />}
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
            className="flex cursor-default flex-row items-center space-x-2 space-y-2 px-4">
            <div className="w-5">{i + 1}.</div>
            <VariantImage image={product.image} onClick={() => {}} />
            <div className="flex-auto">
              <ProductTitle product={product} />
            </div>
            <Button
              buttonStyle="p-2"
              theme="clear"
              onClick={() => removeProductFromCollection(product)}>
              <XIcon className="h-5 w-5 text-gray-500" />
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
            placeholder="Search products"
            onChange={e => onSearch(e.target.value)}
            value={searchTerm}
            leftComponent={<SearchIcon className="h-5 w-5 text-gray-500" />}
          />
        </div>
        <Border />

        {products.map((product, i) => (
          <li
            key={i}
            className="flex flex-row items-center space-x-4 py-2 px-4 hover:bg-gray-100"
            onClick={() => addRemoveProduct(product)}>
            <Checkbox
              checked={selectedProductIDs.includes(product.id)}
              name="product"
              onChange={() => {}}
            />
            <VariantImage image={product.image} onClick={() => {}} />
            <div className="">{product.title}</div>
          </li>
        ))}
      </Modal>
    </Card>
  );
}
