import React from 'react';
import Subheader from '../../components/Subheader';
import Label from '../../components/forms/Label';
import InputText from '../../components/forms/InputText';
import Select from '../../components/forms/Select';

interface Props {}

export default function ShippingInfo({}: Props) {
  return (
    <div className="px-5">
      <Subheader text="TRACKING INFORMATION (OPTIONAL)" style="text-xs" />

      <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <Label title="Tracking number" />
          <InputText name="first_name" value="" onChange={e => {}} />
        </div>

        <div className="sm:col-span-3">
          <Label title="Shipping carrier" />
          <Select name="shipping_carrier" onChange={() => {}}>
            <option value="">Select</option>
            <option value="1">DHL</option>
          </Select>
        </div>
      </div>
    </div>
  );
}
