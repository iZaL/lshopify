import React, {useState} from 'react';
import {Variant} from '../../../types';
import InputText from '../../../components/forms/InputText';
import Button from '../../../components/Button'

interface Props {
  variants: Variant[];
  onChange: (variant: Variant, e: string) => void;
  onApplyAll: (text: string) => void;
}

export default function EditPrices({variants, onChange, onApplyAll}: Props) {
  const [allText, setAllText] = useState('');

  return (
    <div className="p-5">
      <p className="text-gray-700 text-sm">Apply a quantity to all variants</p>
      <form
        className="flex space-x-4 border-b border-gray-200 py-3  "
        action="#">
        <div className="flex-1 min-w-0">
          <InputText
            name="item_cost"
            onChange={e => setAllText(e.target.value)}
            leftComponent={
              <div className="text-md text-gray-400 text-sm">OMR</div>
            }
            inputStyle="pl-14"
            placeholder="0"
          />
        </div>
        <Button
          theme='default'
          onClick={() => onApplyAll(allText)}
          >
          Apply to all
        </Button>
      </form>

      {variants.map((variant, i) => {
        return (
          <div
            className="flex space-x-4 border-b border-gray-200 py-3 items-center"
            key={i}>
            <div className="flex-1 min-w-0 text-sm text-gray-800">
              {variant.title}
            </div>
            <div className="w-40">
              <InputText
                name="price"
                leftComponent={
                  <div className="text-md text-gray-400 text-sm">OMR</div>
                }
                inputStyle="pl-14"
                placeholder="0"
                value={variant.price}
                onChange={e => onChange(variant, e.target.value)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
