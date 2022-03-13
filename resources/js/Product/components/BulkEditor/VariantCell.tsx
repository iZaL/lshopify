import {Product, Variant} from '../../../types';
import InputText from '../../../components/forms/InputText';
import React from 'react';
import {AttributeLabel} from './types';
import Checkbox from '../../../components/forms/Checkbox';

export default function VariantCell({
  value,
  attribute,
  onChange,
}: {
  value: string|boolean;
  attribute: keyof Variant;
  onChange: (value: string | boolean) => void;
}) {
  let textAttributes: Array<keyof Variant> = [
    'price',
    'compare_at_price',
    'cost_price',
    'sku',
    'barcode',
    'quantity',
    'weight',
    'hs_code',
  ];

  let booleanAttributes: Array<keyof Variant> = ['out_of_stock_sale', 'track_quantity', 'taxable'];

  let placeholders: AttributeLabel = {
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
        inputStyle="rounded-none border-none shadow-none"
        rightComponent={
          placeholders[attribute] ? <div className="text-md text-sm text-gray-400">OMR</div> : null
        }
      />
    );
  }

  if (booleanAttributes.includes(attribute)) {
    return (
      <Checkbox
        inputStyle="mx-4"
        name={attribute}
        checked={value === true}
        onChange={e => onChange(e.target.checked)}
      />
    );
  }
  return <>---</>;
}
