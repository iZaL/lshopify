import React, {ReactElement, useState} from 'react';
import {Billing, CustomerAddress, Shipping} from '../../types';
import InputText from '../../components/forms/InputText';
import Label from '../../components/forms/Label';

interface Props {
  address: Shipping | Billing;
  // onChange: <T extends keyof Billing>(field: T, value: Billing[T]) => void;
  children: (address: CustomerAddress) => ReactElement;
}

export default function AddressForm({address, children}: Props) {
  const [data, setData] = useState(address);

  const onDataChange = (field: keyof CustomerAddress, value: any) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  return (
    <>
      <div className="p-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <Label title="First name" />
          <InputText
            name="first_name"
            value={data.first_name}
            onChange={e => onDataChange('first_name', e.target.value)}
          />
        </div>

        <div className="sm:col-span-3">
          <Label title="Last name" />
          <InputText
            name="last_name"
            value={data.last_name}
            onChange={e => onDataChange('last_name', e.target.value)}
          />
        </div>

        <div className="sm:col-span-6">
          <Label title="Company" />
          <InputText
            name="company"
            value={data.company}
            onChange={e => onDataChange('company', e.target.value)}
          />
        </div>

        <div className="sm:col-span-6">
          <Label title="Address" />
          <InputText
            name="address1"
            value={data.address1}
            onChange={e => onDataChange('address1', e.target.value)}
          />
        </div>

        <div className="sm:col-span-6">
          <Label title="Apartment, suite, etc." />
          <InputText
            name="address2"
            value={data.address2}
            onChange={e => onDataChange('address2', e.target.value)}
          />
        </div>

        <div className="sm:col-span-6">
          <Label title="Postal code" />
          <InputText
            name="zip"
            value={data.zip}
            onChange={e => onDataChange('zip', e.target.value)}
          />
        </div>

        <div className="sm:col-span-6">
          <Label title="City " />
          <InputText
            name="city"
            value={data.city}
            onChange={e => onDataChange('city', e.target.value)}
          />
        </div>

        <div className="sm:col-span-6">
          <Label title="Country/Region" />
          <InputText
            name="country"
            value={data.country}
            onChange={e => onDataChange('country', e.target.value)}
          />
        </div>

        <div className="sm:col-span-6">
          <Label title="Phone" />
          <InputText
            name="phone"
            value={data.phone}
            onChange={e => onDataChange('phone', e.target.value)}
          />
        </div>
      </div>
      {children(data)}
    </>
  );
}
