import React, {ReactElement, ReactNode, useState} from 'react';
import {Customer, CustomerAddress} from '../../types';
import {CustomerForm} from '../../form_types';
import InputText from '../../components/forms/InputText';
import Checkbox from '../../components/forms/Checkbox';
import Border from '../../components/Border';
import Subheader from '../../components/Subheader';
import Label from '../../components/forms/Label';
import CreateAddressForm from './CreateAddressForm';

interface Props {
  customer?: Customer | null;
  children: (
    customerData: CustomerForm,
    addressData: CustomerAddress
  ) => ReactElement;
}

export default function CreateCustomerForm({customer, children}: Props) {
  let customerForm: CustomerForm = {
    first_name: customer?.first_name || '',
    last_name: customer?.last_name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    tax_exempted: customer?.tax_exempted || false,
    accepts_marketing: customer?.accepts_marketing || false,
  };

  let addressForm: CustomerAddress = {
    first_name: customer?.first_name || '',
    last_name: customer?.last_name || '',
    company: '',
    address1: '',
    address2: '',
    city: '',
    zip: '',
    country: '',
    phone: '',
  };

  const [customerData, setCustomerData] = useState<CustomerForm>({
    ...customerForm,
  });

  const [addressData, setAddressData] = useState<CustomerAddress>({
    ...addressForm,
  });

  const onCustomerAttributeChange = <T extends keyof Customer>(
    field: T,
    value: Customer[T]
  ) => {
    setCustomerData({
      ...customerData,
      [field]: value,
    });

    if (field === 'first_name' || field === 'last_name') {
      setAddressData({
        ...addressData,
        [field]: value,
      });
    }
  };

  const onAddressAttributeChange = <T extends keyof CustomerAddress>(
    field: T,
    value: CustomerAddress[T]
  ) => {
    setAddressData({
      ...addressData,
      [field]: value,
    });
  };

  return (
    <>
      <div className='p-5'>
        <div className='grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
          <div className='sm:col-span-3'>
            <Label title='First name' />
            <InputText
              name='first_name'
              value={customerData.first_name}
              onChange={(e) =>
                onCustomerAttributeChange('first_name', e.target.value)
              }
            />
          </div>
          <div className='sm:col-span-3'>
            <Label title='Last name' />
            <InputText
              name='last_name'
              value={customerData.last_name}
              onChange={(e) =>
                onCustomerAttributeChange('last_name', e.target.value)
              }
            />
          </div>
          <div className='sm:col-span-6'>
            <Label title='Email address' />
            <InputText
              name='email'
              type='email'
              value={customerData.email}
              onChange={(e) =>
                onCustomerAttributeChange('email', e.target.value)
              }
            />
          </div>

          <div className='sm:col-span-6'>
            <Checkbox
              name='accepts_marketing'
              label='Customer accepts email marketing'
              checked={customerData.accepts_marketing}
              onChange={(e) =>
                onCustomerAttributeChange('accepts_marketing', e.target.checked)
              }
            />
          </div>

          <div className='sm:col-span-6'>
            <Checkbox
              name='tax_exempted'
              label='Customer is tax exempt'
              checked={customerData.tax_exempted}
              onChange={(e) =>
                onCustomerAttributeChange('tax_exempted', e.target.checked)
              }
            />
          </div>

          <div className='sm:col-span-6'>
            <Border />

            <Subheader text='Shipping address' />
          </div>

          <CreateAddressForm
            customer={addressData}
            onChange={(field: keyof CustomerAddress, value: any) =>
              onAddressAttributeChange(field, value)
            }
          />
        </div>
      </div>
      {children(customerData, addressData)}
    </>
  );
}
