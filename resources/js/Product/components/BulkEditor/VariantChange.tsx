import {Product, Variant} from '../../../types';
import InputText from '../../../components/forms/InputText';
import React from 'react';
import {AttributeLabel} from './types';

export default function VariantChange({
  variant,
  attribute,
  onChange,
}: {
  variant: Variant;
  attribute: keyof Variant;
  onChange: (value: string) => void;
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
        value={variant[attribute]}
        onChange={e => onChange(e.target.value)}
        inputStyle="rounded-none border-none shadow-none"
        rightComponent={
          placeholders[attribute] ? (
            <div className="text-md text-sm text-gray-400">OMR</div>
          ) : null
        }
      />
    );
  }

  return <>---</>;
}
