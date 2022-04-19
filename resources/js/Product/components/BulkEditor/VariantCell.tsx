import React from 'react';
import Checkbox from '../../../components/forms/Checkbox';
import InputText from '../../../components/forms/InputText';
import {Variant} from '../../../types';
import {AttributeLabel} from './types';

export default function VariantCell({
  value,
  attribute,
  onChange,
}: {
  value: string | boolean;
  attribute: keyof Variant;
  onChange: (value: string | boolean) => void;
}) {
  const textAttributes: Array<keyof Variant> = [
    'price',
    'compare_at_price',
    'cost_price',
    'sku',
    'barcode',
    'quantity',
    'weight',
    'hs_code',
  ];

  const booleanAttributes: Array<keyof Variant> = [
    'out_of_stock_sale',
    'tracked',
    'taxable',
    'requires_shipping',
  ];

  const placeholders: AttributeLabel = {
    price: 'OMR',
    compare_at_price: 'OMR',
    cost_price: 'OMR',
  };

  if (textAttributes.includes(attribute)) {
    return (
      <InputText
        key={attribute}
        name={attribute}
        value={value}
        onChange={e => onChange(e.target.value)}
        inputStyle="min-w-[150px] rounded-none shadow-none border-none focus:rounded-none"
        rightComponent={
          placeholders[attribute] ? (
            <div className="text-md text-sm text-gray-400">OMR</div>
          ) : null
        }
      />
    );
  }

  if (booleanAttributes.includes(attribute)) {
    return (
      <Checkbox
        name={attribute}
        checked={value === true}
        onChange={e => onChange(e.target.checked)}
        inputStyle="mx-4 "
      />
    );
  }
  return <>---</>;
}
