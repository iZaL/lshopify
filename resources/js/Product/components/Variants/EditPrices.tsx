import React, {useState} from 'react';
import Button from '../../../components/Button';
import InputText from '../../../components/forms/InputText';
import {Variant} from '../../../types';

interface Props {
  variants: Variant[];
  onChange: (variant: Variant, e: string) => void;
  onApplyAll: (text: string) => void;
}

export default function EditPrices({variants, onChange, onApplyAll}: Props) {
  const [allText, setAllText] = useState('');

  return (
    <div className="p-5">
      <p className="text-sm text-gray-700">Apply a quantity to all variants</p>
      <div className="flex space-x-4 border-b border-gray-200 py-3  ">
        <div className="min-w-0 flex-1">
          <InputText
            name="item_cost"
            onChange={e => setAllText(e.target.value)}
            leftComponent={
              <div className="text-md text-sm text-gray-400">OMR</div>
            }
            inputStyle="pl-14"
            placeholder="0"
          />
        </div>
        <Button theme="default" onClick={() => onApplyAll(allText)}>
          Apply to all
        </Button>
      </div>

      {variants.map((variant, i) => (
        <div
          className="flex items-center space-x-4 border-b border-gray-200 py-3"
          key={i}>
          <div className="min-w-0 flex-1 text-sm text-gray-800">
            {variant.title}
          </div>
          <div className="w-40">
            <InputText
              name="price"
              leftComponent={
                <div className="text-md text-sm text-gray-400">OMR</div>
              }
              inputStyle="pl-14"
              placeholder="0"
              value={variant.price}
              onChange={e => onChange(variant, e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
