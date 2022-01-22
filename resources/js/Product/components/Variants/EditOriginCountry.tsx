import React, {useState} from 'react';
import {Variant} from '../../../types';
import Button from '../../../components/Button'

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
      <p className="text-gray-700 text-sm">Country/Region of origin</p>
      <form
        className="flex space-x-4 border-b border-gray-200 py-3  "
        action="#">
        <div className="flex-1 min-w-0">
          <select
            id="country"
            name="country"
            autoComplete="country"
            className="mt-1 p-2 block focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm border-2 border-gray-300 rounded-md"
            onChange={e => setAllText(e.target.value)}>
            <option value="1">United States</option>
            <option value="2">Canada</option>
            <option value="3">Mexico</option>
          </select>
        </div>
        <Button
          theme='default'
          onClick={() => onApplyAll(allText)}>
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

            <div className="w-24">
              <select
                id="country"
                name="country"
                autoComplete="country"
                className="mt-1 p-2 block focus:ring-indigo-500 focus:border-indigo-500 w-full sm:text-sm border-2 border-gray-300 rounded-md"
                value={variant.origin_country_id}
                onChange={e => onChange(variant, e.target.value)}>
                <option value="1">United States</option>
                <option value="2">Canada</option>
                <option value="3">Mexico</option>
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
}
