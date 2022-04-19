import {XIcon} from '@heroicons/react/solid';
import React from 'react';
import Card from '../../../components/Card';
import Subheader from '../../../components/Subheader';
import AddressCard from '../../../Customer/components/AddressCard';
import ContactCard from '../../../Customer/components/ContactCard';
import {Customer, CustomerAddress, Order} from '../../../types';

interface Props {
  onCustomerRemove: (customer: Customer) => void;
  onCustomerAddressSave: (
    addressType: 'shipping' | 'billing',
    addressAttributes: CustomerAddress,
  ) => void;
  order: Order;
  onChange: <T extends keyof Order>(field: T, value: any) => void;
  onContactSave: (attributes: {
    contact_email: string;
    contact_phone: string;
  }) => void;
}

export default function CustomerEdit({
  order,
  onCustomerRemove,
  onCustomerAddressSave,
  onContactSave,
}: Props) {
  if (!order.customer) {
    return null;
  }

  return (
    <Card>
      <div className="">
        <div className="flex flex-row items-center justify-between">
          <Subheader text="Customer" />
          <XIcon
            className="w-5 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() =>
              order.customer ? onCustomerRemove(order.customer) : {}
            }
          />
        </div>

        <div className="mt-2 text-sm text-blue-500 underline">
          {order.customer.full_name}
        </div>
      </div>

      <ContactCard
        email={order.contact_email}
        phone={order.contact_phone}
        onSave={onContactSave}
      />

      <AddressCard
        address={order.shipping}
        onSave={attributes => onCustomerAddressSave('shipping', attributes)}
        title="SHIPPING ADDRESS"
      />

      <AddressCard
        address={order.billing}
        onSave={attributes => onCustomerAddressSave('billing', attributes)}
        title="BILLING ADDRESS"
      />
    </Card>
  );
}
