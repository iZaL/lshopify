import React, {useState} from 'react';
import Button from '../../../components/Button';
import InputText from '../../../components/forms/InputText';
import {Variant} from '../../../types';

interface Props {
  variants: Variant[];
  onChange: (variant: Variant, e: string) => void;
  onApplyAll: (text: string) => void;
}

export default function EditQuantities({
  variants,
  onChange,
  onApplyAll,
}: Props) {
  const [allText, setAllText] = useState('');

  return (
    <div className="p-5">
      <p className="text-sm text-gray-700">Apply a price to all variants</p>
      <div className="flex space-x-4 border-b border-gray-200 py-3">
        <div className="min-w-0 flex-1">
          <InputText
            name="all"
            onChange={e => setAllText(e.target.value)}
            leftComponent={
              <div className="text-md text-sm text-gray-400">QTY</div>
            }
            inputStyle="pl-14"
            placeholder="0"
          />
        </div>
        <Button
          theme="default"
          onClick={() => onApplyAll(allText)}
          buttonStyle="inline-flex justify-center items-center border px-2 rounded-md "
          border
          rounded>
          Apply to all
        </Button>
      </div>

      {variants.map((variant, i) => {
        return (
          <div
            className="flex items-center space-x-4 border-b border-gray-200 py-3"
            key={i}>
            <div className="min-w-0 flex-1 text-sm text-gray-800">
              {variant.title}
            </div>

            <div className="w-24">
              <InputText
                name="price"
                onChange={e => onChange(variant, e.target.value)}
                placeholder="0"
                value={variant.quantity}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
