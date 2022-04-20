import React, {useState} from 'react';

import Button from '../../../components/Button';
import InputText from '../../../components/forms/InputText';
import {Variant} from '../../../types';

interface Props {
  variants: Variant[];
  onChange: (variant: Variant, e: string) => void;
  onApplyAll: (text: string) => void;
}

export default function EditHSCodes({variants, onChange, onApplyAll}: Props) {
  const [allText, setAllText] = useState('');

  return (
    <div className="p-5">
      <p className="text-sm text-gray-700">HS (Harmonized System) code</p>
      <div className="flex space-x-4 border-b border-gray-200 py-3  ">
        <div className="min-w-0 flex-1">
          <InputText
            name="all"
            onChange={e => setAllText(e.target.value)}
            placeholder="Search or enter a HS codes"
          />
        </div>
        <Button theme="default" onClick={() => onApplyAll(allText)}>
          Apply to all
        </Button>
      </div>

      {variants.map((variant, idx) => (
        <div
          className="flex items-center space-x-4 border-b border-gray-200 py-3"
          key={idx}>
          <div className="min-w-0 flex-1 text-sm text-gray-800">
            {variant.title}
          </div>

          <div className="w-56">
            <InputText
              name="price"
              value={variant.hs_code}
              onChange={e => onChange(variant, e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
