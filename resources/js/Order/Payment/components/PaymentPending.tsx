import React from 'react';
import Border from '../../../components/Border';
import DropdownButton from '../../../components/DropdownButton';
import {Order} from '../../../types';

interface Props {
  onPaidClick: () => void;
  order: Order;
}

export default function PaymentPending({order, onPaidClick}: Props) {
  return (
    <div className="max-w-3xl mx-auto text-sm">
      <div className="grid grid-cols-5 ">
        <div>Subtotal</div>
        <div className="col-span-3">{order.quantity} Item</div>
        <div className="justify-self-end">OMR {order.subtotal}</div>
      </div>

      <div className="mt-2 grid grid-cols-5 ">
        <div className="col-span-4">Total</div>
        <div className="justify-self-end">OMR {order.total}</div>
      </div>

      <Border />

      <div className="grid grid-cols-5 ">
        <div className="col-span-4">Paid by customer</div>
        <div className="justify-self-end">OMR 0.00</div>
      </div>

      <Border />

      <div className="flex justify-end">
        <DropdownButton
          buttonTitle="Collect payment"
          arrowVisible={true}
          items={[
            {
              title: 'Send invoice',
              onClick: () => {},
            },
            {
              title: 'Mark as paid',
              onClick: onPaidClick,
            },
          ]}
        />
      </div>
    </div>
  );
}
