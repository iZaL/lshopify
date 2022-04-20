import React, {useState} from 'react';

import Button from '../../../components/Button';
import {Variant} from '../../../types';

interface Props {
  variants: Variant[];
  onChange: (variant: Variant, e: string) => void;
  onApplyAll: (text: string) => void;
}

export default function EditOriginCountry({
  variants,
  onChange,
  onApplyAll,
}: Props) {
  const [allText, setAllText] = useState('');

  return (
    <div className="p-5">
      <p className="text-sm text-gray-700">Country/Region of origin</p>
      <div className="flex space-x-4 border-b border-gray-200 py-3  ">
        <div className="min-w-0 flex-1">
          <select
            id="country"
            name="country"
            autoComplete="country"
            className="mt-1 block w-full rounded-md border-2 border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            onChange={e => setAllText(e.target.value)}>
            <option value="1">United States</option>
            <option value="2">Canada</option>
            <option value="3">Mexico</option>
          </select>
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

          <div className="w-24">
            <select
              id="country"
              name="country"
              autoComplete="country"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={variant.origin_country_id}
              onChange={e => onChange(variant, e.target.value)}>
              <option value="1">United States</option>
              <option value="2">Canada</option>
              <option value="3">Mexico</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
