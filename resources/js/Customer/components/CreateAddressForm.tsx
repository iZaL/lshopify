import React from 'react';
import {CustomerAddress} from '../../types';
import InputText from '../../components/forms/InputText';
import Label from '../../components/forms/Label';

interface Props {
  customer: CustomerAddress;
  onChange: <T extends keyof CustomerAddress>(
    field: T,
    value: CustomerAddress[T],
  ) => void;
}

export default function CreateAddressForm({customer, onChange}: Props) {
  return (
    <>
      <div className="sm:col-span-6">
        <Label title="Company" />
        <InputText
          name="company"
          value={customer.company}
          onChange={e => onChange('company', e.target.value)}
        />
      </div>

      <div className="sm:col-span-6">
        <Label title="Address" />
        <InputText
          name="address1"
          value={customer.address1}
          onChange={e => onChange('address1', e.target.value)}
        />
      </div>

      <div className="sm:col-span-6">
        <Label title="Apartment, suite, etc." />
        <InputText
          name="address2"
          value={customer.address2}
          onChange={e => onChange('address2', e.target.value)}
        />
      </div>

      <div className="sm:col-span-6">
        <Label title="Postal code" />
        <InputText
          name="zip"
          value={customer.zip}
          onChange={e => onChange('zip', e.target.value)}
        />
      </div>

      <div className="sm:col-span-6">
        <Label title="City " />
        <InputText
          name="city"
          value={customer.city}
          onChange={e => onChange('city', e.target.value)}
        />
      </div>

      <div className="sm:col-span-6">
        <Label title="Country/Region" />
        <InputText
          name="country"
          value={customer.country}
          onChange={e => onChange('country', e.target.value)}
        />
      </div>

      <div className="sm:col-span-6">
        <Label title="Phone" />
        <InputText
          name="phone"
          value={customer.phone}
          onChange={e => onChange('phone', e.target.value)}
        />
      </div>
    </>
  );
}
