import React, {useState} from 'react';
import {Variant} from '../../../types';
import InputText from '../../../components/forms/InputText';
import Button from '../../../components/Button';

interface Props {
  variants: Variant[];
  onChange: (variant: Variant, e: string) => void;
  onApplyAll: (text: string) => void;
}

export default function EditHSCodes({variants, onChange, onApplyAll}: Props) {
  const [allText, setAllText] = useState('');

  return (
    <div className="p-5">
      <p className="text-gray-700 text-sm">HS (Harmonized System) code</p>
      <form
        className="flex space-x-4 border-b border-gray-200 py-3  "
        action="#">
        <div className="flex-1 min-w-0">
          <InputText
            name="all"
            onChange={e => setAllText(e.target.value)}
            placeholder="Search or enter a HS codes"
          />
        </div>
        <Button theme="default" onClick={() => onApplyAll(allText)}>
          Apply to all
        </Button>
      </form>

      {variants.map(variant => {
        return (
          <div className="flex space-x-4 border-b border-gray-200 py-3 items-center">
            <div className="flex-1 min-w-0 text-sm text-gray-800">
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
        );
      })}
    </div>
  );
}
