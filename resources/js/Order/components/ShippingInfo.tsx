import React from 'react';

import InputText from '../../components/forms/InputText';
import Label from '../../components/forms/Label';
import Select from '../../components/forms/Select';
import Subheader from '../../components/Subheader';

export default function ShippingInfo() {
  return (
    <div className="px-5">
      <Subheader text="TRACKING INFORMATION (OPTIONAL)" headerStyle="text-xs" />

      <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <Label title="Tracking number" />
          <InputText name="first_name" value="" onChange={() => {}} />
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
