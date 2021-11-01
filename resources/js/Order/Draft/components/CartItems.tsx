import React from 'react';
import {XIcon} from '@heroicons/react/solid';
import {CartDiscount, CartItem} from '../../../types';
import VariantImage from '../../../Product/Variant/components/VariantImage';
import ProductTitle from '../../../Product/components/ProductTitle';
import InputText from '../../../components/forms/InputText';
import Button from '../../../components/Button';

interface Props {
  items: CartItem[];
  onVariantRemove: (rowId: string) => void;
  onVariantEdit: (rowId: string, item: CartItem) => void;
  onShowDiscountDialog: (discount: CartDiscount, item?: CartItem) => void;
}

export default function CartItems({
  items,
  onVariantEdit,
  onVariantRemove,
  onShowDiscountDialog,
}: Props) {
  const onVariantAttributeChange = <T extends keyof CartItem>(
    item: CartItem,
    field: T,
    value: CartItem[T]
  ) => {
    let cartItem = items.find(({id}) => id === item.id);
    if (cartItem) {
      cartItem = {
        ...cartItem,
        [field]: value,
      };
      onVariantEdit(item.rowId, cartItem);
    }
  };

  const removeItem = (item: CartItem) => {
    onVariantRemove(item.rowId);
  };

  if (!items.length) {
    return null;
  }

  return (
    <>
      <div className='grid grid-cols-6 items-center space-x-4'>
        <div className='col-span-4'>Product</div>
        <div>Quantity</div>
        <div>Total</div>
      </div>

      {items.map((item, i) => {
        return (
          <div
            className='grid grid-cols-6 items-center space-x-4 text-sm '
            key={i}
          >
            <div className='col-span-4 inline-flex space-x-2 items-center'>
              <VariantImage
                image={item.variant.image}
                onClick={() => {}}
                style='w-12 h-12'
              />
              <div className=' text-sm'>
                {item.variant.product && (
                  <div className='underline'>
                    <ProductTitle product={item.variant.product} />
                  </div>
                )}
                <div className=''>{item.variant.title}</div>
                <div className='space-x-2'>
                  <span
                    className='cursor-pointer hover:underline text-blue-500'
                    onClick={() => onShowDiscountDialog(item.discount, item)}
                  >
                    OMR {item.unit_price}
                  </span>
                  <span className='strike line-through text-gray-500'>
                    {item.total !== item.subtotal && `OMR ${item.price}`}
                  </span>
                </div>
              </div>
            </div>
            <div className=''>
              <InputText
                name='quantity'
                value={item.quantity}
                onChange={(e) =>
                  onVariantAttributeChange(item, 'quantity', e.target.value)
                }
              />
            </div>
            <div className='inline-flex justify-around'>
              <div>OMR {item.total}</div>
              <div className=''>
                <Button theme='clear' onClick={() => removeItem(item)}>
                  <XIcon className='text-md w-5 h-5 cursor-pointer hover:text-gray-500' />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
