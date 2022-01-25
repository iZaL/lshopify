import React from 'react';
import Card from '../../components/Card';
import Label from '../../components/forms/Label';
import InputText from '../../components/forms/InputText';
import Subheader from '../../components/Subheader';
import Checkbox from '../../components/forms/Checkbox';
import {SearchIcon} from '@heroicons/react/solid';
import {Variant} from '../../types';

interface Props {
  variant: Variant;
  onChange: (field: keyof Variant, value: any) => void;
}

export default function ShippingSection({variant, onChange}: Props) {
  return (
    <Card>
      <Subheader text="Shipping" />

      <Checkbox
        name="physical_product"
        label="This is a physical product"
        checked={variant.physical_product}
        onChange={e => onChange('physical_product', e.target.checked)}
      />

      <div className="w-full border-t border-gray-300" />

      {variant.physical_product && (
        <>
          <Subheader text="WEIGHT" headerStyle="text-xs" />

          <div className="">
            <Label title="Weight" />
            <div className="flex">
              <InputText
                name="Weight"
                value={variant.weight || ''}
                onChange={e => onChange('weight', e.target.value)}
                rightComponent={<div className="text-sm text-gray-400">KG</div>}
              />
            </div>
          </div>

          <div className="w-full border-t border-gray-300" />

          <Subheader text="CUSTOMS INFORMATION" headerStyle="text-xs" />

          <div className="min-w-0 flex-1">
            <span className="block py-1 text-sm text-gray-500">
              Customs authorities use this information to calculate duties when
              shipping internationally. Shown on printed customs forms.
            </span>
          </div>

          <div className="">
            <Label title="Country/Region of origin" />
            <select
              id="country"
              name="country"
              autoComplete="country"
              className="mt-1 block w-full rounded-md border-2 border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              onChange={e => onChange('origin_country_id', e.target.value)}
              value={variant.origin_country_id || 0}>
              <option value="1">United States</option>
              <option value="2">Canada</option>
              <option value="3">Mexico</option>
            </select>
            <div className="">
              <span className="block py-1 text-sm text-gray-500">
                In most cases, where the product is manufactured.
              </span>
            </div>
          </div>

          <div className="">
            <Label title="HS (Harmonized System) code" />
            <InputText
              name="hs_code"
              value={variant.hs_code || ''}
              onChange={e => onChange('hs_code', e.target.value)}
              leftComponent={<SearchIcon className="h-5 w-5 text-gray-400" />}
              placeholder="Search or enter a HS code"
            />
          </div>
        </>
      )}

      {!variant.physical_product && (
        <div className="min-w-0 flex-1">
          <Subheader text="WEIGHT" headerStyle="text-xs" />
          <span className="block py-1 text-sm text-gray-500">
            Used to calculate shipping rates at checkout and label prices during
            fulfillment.
          </span>
        </div>
      )}
    </Card>
  );
}
