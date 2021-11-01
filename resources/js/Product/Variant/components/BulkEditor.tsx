import React, {ReactElement, useState} from 'react';
import {Variant} from '../../../types';
import InputText from '../../../components/forms/InputText';
import {CheckCircleIcon, SearchIcon, XIcon} from '@heroicons/react/solid';
import Checkbox from '../../../components/forms/Checkbox';

interface Props {
  variants: Variant[];
  children: (variants: Variant[]) => ReactElement;
}

export default function BulkEditor({variants, children}: Props) {
  const defaultAttributes: Array<keyof Variant> = [
    'price',
    'compare_at_price',
    'cost_price',
    'taxable',
    'sku',
    'barcode',
    'weight',
    'quantity',
    'hs_code',
    'out_of_stock_sale',
    'track_quantity',
    'requires_shipping',
    'weight',
    'origin_country_id',
  ];

  const defaultSelectedAttributes: Array<keyof Variant> = [
    'price',
    'sku',
    'quantity',
  ];

  const [selectedAttributes, setSelectedAttributes] = useState<
    Array<keyof Variant>
  >(defaultSelectedAttributes);

  const [currentVariants, setCurrentVariants] = useState<Variant[]>(variants);

  const onAttributeChange = <T extends keyof Variant>(
    selectedVariant: Variant,
    field: T,
    value: Variant[T]
  ) => {
    const newVariants = currentVariants.map((variant) => {
      if (variant.id === selectedVariant.id) {
        return {
          ...variant,
          [field]: value,
        };
      }
      return variant;
    });

    setCurrentVariants(newVariants);
  };

  const onAttributesRemove = (attribute: keyof Variant) => {
    setSelectedAttributes(
      selectedAttributes.filter((attr) => attr !== attribute)
    );
  };
  const onAttributesAdd = (attribute: keyof Variant) => {
    setSelectedAttributes([...selectedAttributes, attribute]);
  };

  return (
    <>
      <div className='p-5'>
        <div className='flex flex-row  flex-wrap '>
          {defaultAttributes.map((attr, i) => {
            return (
              <div className='mb-2 pr-2' key={i}>
                <div className='flex flex-row bg-gray-200 rounded rounded-md items-center justify-end h-6 overflow-hidden '>
                  <div className='px-2 flex-1'>{attr}</div>
                  {selectedAttributes.includes(attr) ? (
                    <XIcon
                      className='w-6 h-6 hover:bg-gray-300 cursor-pointer hover:rounded hover:rounded-md'
                      onClick={() => {
                        onAttributesRemove(attr);
                      }}
                    />
                  ) : (
                    <CheckCircleIcon
                      className='w-6 h-6 hover:bg-gray-300 cursor-pointer hover:rounded hover:rounded-md text-green-500'
                      onClick={() => {
                        onAttributesAdd(attr);
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className='overflow-x-scroll'>
          <div className='mt-4'>
            <div className='flex flex-row items-center flex-shrink-0 pb-2 space-x-4 border-b border-gray-200 font-semibold'>
              <div className='flex-shrink-0 w-40'>Title</div>
              {selectedAttributes.includes('price') && (
                <div className='flex-shrink-0 w-40'>Price</div>
              )}
              {selectedAttributes.includes('compare_at_price') && (
                <div className='flex-shrink-0 w-40'>Compare at price</div>
              )}
              {selectedAttributes.includes('cost_price') && (
                <div className='flex-shrink-0 w-40'>Cost per item</div>
              )}
              {selectedAttributes.includes('taxable') && (
                <div className='flex-shrink-0 w-40'>Charge Taxes</div>
              )}
              {selectedAttributes.includes('quantity') && (
                <div className='flex-shrink-0 w-40'>Quantity</div>
              )}
              {selectedAttributes.includes('sku') && (
                <div className='flex-shrink-0 w-40'>SKU</div>
              )}
              {selectedAttributes.includes('barcode') && (
                <div className='flex-shrink-0 w-40'>Barcode</div>
              )}
              {selectedAttributes.includes('out_of_stock_sale') && (
                <div className='flex-shrink-0 w-40'>
                  Continue selling when out of stock
                </div>
              )}
              {selectedAttributes.includes('track_quantity') && (
                <div className='flex-shrink-0 w-40'>Track Quantity</div>
              )}
              {selectedAttributes.includes('requires_shipping') && (
                <div className='flex-shrink-0 w-40'>Requires Shipping</div>
              )}
              {selectedAttributes.includes('physical_product') && (
                <div className='flex-shrink-0 w-40'>Physical Product</div>
              )}
              {selectedAttributes.includes('weight') && (
                <div className='flex-shrink-0 w-40'>Weight</div>
              )}
              {selectedAttributes.includes('hs_code') && (
                <div className='flex-shrink-0 w-40'>HS Code</div>
              )}
              {selectedAttributes.includes('origin_country_id') && (
                <div className='flex-shrink-0 w-40'>Country of origin</div>
              )}
            </div>
          </div>

          <ul className='mt-4 space-y-4 mb-10'>
            {currentVariants.map((variant, i) => {
              return (
                <li
                  className='flex flex-row items-center flex-shrink-0 space-x-4'
                  key={i}
                >
                  <div className='flex-shrink-0 w-40'>{variant.title}</div>
                  {selectedAttributes.includes('price') && (
                    <div className='flex-shrink-0 w-40'>
                      <InputText
                        name='price'
                        onChange={(e) =>
                          onAttributeChange(variant, 'price', e.target.value)
                        }
                        leftComponent={
                          <div className='text-md text-gray-400 text-sm'>
                            OMR
                          </div>
                        }
                        style='pl-14'
                        placeholder='0.00'
                        value={variant.price}
                      />
                    </div>
                  )}
                  {selectedAttributes.includes('compare_at_price') && (
                    <div className='flex-shrink-0 w-40'>
                      <InputText
                        name='compare_at_price'
                        onChange={(e) =>
                          onAttributeChange(
                            variant,
                            'compare_at_price',
                            e.target.value
                          )
                        }
                        leftComponent={
                          <div className='text-md text-gray-400 text-sm'>
                            OMR
                          </div>
                        }
                        style='pl-14'
                        placeholder='0.00'
                        value={variant.compare_at_price}
                      />
                    </div>
                  )}
                  {selectedAttributes.includes('cost_price') && (
                    <div className='flex-shrink-0 w-40'>
                      <InputText
                        name='cost_price'
                        onChange={(e) =>
                          onAttributeChange(
                            variant,
                            'cost_price',
                            e.target.value
                          )
                        }
                        leftComponent={
                          <div className='text-md text-gray-400 text-sm'>
                            OMR
                          </div>
                        }
                        style='pl-14'
                        placeholder='0.00'
                        value={variant.cost_price}
                      />
                    </div>
                  )}
                  {selectedAttributes.includes('taxable') && (
                    <div className='flex-shrink-0 w-40'>
                      <Checkbox
                        name='taxable'
                        checked={variant.taxable}
                        onChange={(e) =>
                          onAttributeChange(
                            variant,
                            'taxable',
                            e.target.checked
                          )
                        }
                      />
                    </div>
                  )}

                  {selectedAttributes.includes('quantity') && (
                    <div className='flex-shrink-0 w-40'>
                      <InputText
                        name='quantity'
                        onChange={(e) =>
                          onAttributeChange(variant, 'quantity', e.target.value)
                        }
                        value={variant.quantity}
                      />
                    </div>
                  )}
                  {selectedAttributes.includes('sku') && (
                    <div className='flex-shrink-0 w-40'>
                      <InputText
                        name='sku'
                        onChange={(e) =>
                          onAttributeChange(variant, 'sku', e.target.value)
                        }
                        value={variant.sku}
                      />
                    </div>
                  )}
                  {selectedAttributes.includes('barcode') && (
                    <div className='flex-shrink-0 w-40'>
                      <InputText
                        name='barcode'
                        onChange={(e) =>
                          onAttributeChange(variant, 'barcode', e.target.value)
                        }
                        value={variant.barcode}
                      />
                    </div>
                  )}
                  {selectedAttributes.includes('out_of_stock_sale') && (
                    <div className='flex-shrink-0 w-40 '>
                      <Checkbox
                        name='out_of_stock_sale'
                        style='text-center'
                        checked={variant.out_of_stock_sale}
                        onChange={(e) =>
                          onAttributeChange(
                            variant,
                            'out_of_stock_sale',
                            e.target.checked
                          )
                        }
                      />
                    </div>
                  )}
                  {selectedAttributes.includes('track_quantity') && (
                    <div className='flex-shrink-0 w-40'>
                      <Checkbox
                        name='track_quantity'
                        checked={variant.track_quantity}
                        onChange={(e) =>
                          onAttributeChange(
                            variant,
                            'track_quantity',
                            e.target.checked
                          )
                        }
                      />
                    </div>
                  )}
                  {selectedAttributes.includes('physical_product') && (
                    <div className='flex-shrink-0 w-40 '>
                      <Checkbox
                        name='physical_product'
                        checked={variant.physical_product}
                        onChange={(e) =>
                          onAttributeChange(
                            variant,
                            'physical_product',
                            e.target.checked
                          )
                        }
                      />
                    </div>
                  )}

                  {selectedAttributes.includes('requires_shipping') && (
                    <div className='flex-shrink-0 w-40 '>
                      <Checkbox
                        name='requires_shipping'
                        checked={variant.requires_shipping}
                        onChange={(e) =>
                          onAttributeChange(
                            variant,
                            'requires_shipping',
                            e.target.checked
                          )
                        }
                      />
                    </div>
                  )}

                  {selectedAttributes.includes('weight') && (
                    <div className='flex-shrink-0 w-40'>
                      <InputText
                        name='Weight'
                        value={variant.weight}
                        onChange={(e) =>
                          onAttributeChange(variant, 'weight', e.target.value)
                        }
                        rightComponent={
                          <div className='text-sm text-gray-400'>KG</div>
                        }
                      />
                    </div>
                  )}
                  {selectedAttributes.includes('hs_code') && (
                    <div className='flex-shrink-0 w-40'>
                      <InputText
                        name='hs_code'
                        value={variant.hs_code || ''}
                        onChange={(e) =>
                          onAttributeChange(variant, 'hs_code', e.target.value)
                        }
                        leftComponent={
                          <SearchIcon className='h-5 w-5 text-gray-400' />
                        }
                        placeholder='Search or enter a HS code'
                      />
                    </div>
                  )}
                  {selectedAttributes.includes('origin_country_id') && (
                    <div className='flex-shrink-0 w-40'>
                      <select
                        id='country'
                        name='country'
                        autoComplete='country'
                        className='mt-1 p-2 block focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm border-2 border-gray-300 rounded-md'
                        onChange={(e) =>
                          onAttributeChange(
                            variant,
                            'origin_country_id',
                            e.target.value
                          )
                        }
                        value={variant.origin_country_id || 0}
                      >
                        <option value='1'>United States</option>
                        <option value='2'>Canada</option>
                        <option value='3'>Mexico</option>
                      </select>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {children(currentVariants)}
    </>
  );
}
