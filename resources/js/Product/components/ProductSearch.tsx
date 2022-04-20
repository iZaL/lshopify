import {SearchIcon} from '@heroicons/react/outline';
import React, {useState} from 'react';

import Border from '../../components/Border';
import Button from '../../components/Button';
import Checkbox from '../../components/forms/Checkbox';
import InputText from '../../components/forms/InputText';
import Modal from '../../components/Modal';
import {CartItem, Product, Variant} from '../../types';
import VariantImage from '../Variant/components/VariantImage';

interface Props {
  searchTerm: string;
  setSearchTerm: (text: string) => void;
  products: Product[];
  onVariantsAdd: (variants: number[]) => void;
  items: CartItem[];
}

export default function ProductSearch({
  setSearchTerm,
  searchTerm,
  products,
  onVariantsAdd,
  items,
}: Props) {
  const [showDialog, setShowDialog] = useState(false);

  const [selectedVariantIDs, setSelectedVariantIDs] = useState<number[]>(
    items.map(({id}) => id),
  );

  // useEffect(() => {
  //   setSelectedVariantIDs(items.map(({id}) => id));
  // }, [showDialog === 'product_list']);

  const addRemoveVariant = (variant: Variant) => {
    const newVariantIDs = selectedVariantIDs.includes(variant.id)
      ? selectedVariantIDs.filter(id => id !== variant.id)
      : [...selectedVariantIDs, variant.id];
    setSelectedVariantIDs(newVariantIDs);
  };

  const onAddToCartConfirm = () => {
    setShowDialog(false);
    onVariantsAdd(selectedVariantIDs);
  };

  return (
    <div className="flex flex-row flex-wrap items-stretch">
      <div className="flex flex-auto">
        <div className="flex-auto">
          <InputText
            name="search"
            placeholder="Search products"
            onChange={e => {
              setSearchTerm(e.target.value);
              setShowDialog(true);
            }}
            value=""
            leftComponent={<SearchIcon className="h-5 w-5 text-gray-500" />}
          />
        </div>
        <Button
          theme="default"
          onClick={() => setShowDialog(true)}
          buttonStyle="ml-2">
          Browse
        </Button>
      </div>

      <Modal
        heading="Select products"
        visible={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={() => onAddToCartConfirm()}
        width="max-w-xl">
        <div className="p-5">
          <InputText
            name="product_search"
            placeholder="Search products"
            onChange={e => setSearchTerm(e.target.value)}
            value={searchTerm}
            leftComponent={<SearchIcon className="h-5 w-5 text-gray-500" />}
          />
        </div>

        <Border />

        {products.map((product, i) => (
          <div key={i}>
            <li
              className="flex flex-row items-center space-x-4 border-b border-gray-200 py-2 px-4
              text-sm hover:bg-gray-100
              "
              onClick={() =>
                !product.variants?.length &&
                addRemoveVariant(product.default_variant)
              }>
              <div>{i + 1}.</div>

              {!product.variants?.length && (
                <Checkbox
                  checked={selectedVariantIDs.includes(
                    product.default_variant?.id,
                  )}
                  name="product"
                  onChange={() => {}}
                />
              )}

              <VariantImage
                image={product.image}
                onClick={() => {}}
                imageStyle="w-12 h-12"
              />
              <div className="flex-auto">{product.title}</div>
              {!product.variants?.length && (
                <>
                  <div className="w-20">0 available</div>
                  <div className="w-20">OMR 10</div>
                </>
              )}
            </li>
            {product.variants?.map((variant, idx) => (
              <li
                className="flex flex-row items-center space-x-4 border-b border-gray-200 py-2 px-4 pl-11
              text-sm hover:bg-gray-100
              "
                key={idx}
                onClick={() => addRemoveVariant(variant)}>
                <Checkbox
                  checked={selectedVariantIDs.includes(variant.id)}
                  name="product"
                  onChange={() => {}}
                />
                <VariantImage
                  image={variant.image}
                  onClick={() => {}}
                  imageStyle="w-12 h-12"
                />
                <div className="flex-auto">{variant.title}</div>
                <div className="w-20">{variant.quantity} available</div>
                <div className="w-20">{variant.price}</div>
              </li>
            ))}
          </div>
        ))}
      </Modal>
    </div>
  );
}
