import React from 'react';
import {Payment} from '../../../types';
import Border from '../../../components/Border';

interface Props {
  payment: Payment;
  quantity: number;
}

export default function PaymentPaid({payment, quantity}: Props) {
  return (
    <div className="mx-auto max-w-3xl text-sm">
      <div className="grid grid-cols-5 ">
        <div>Subtotal</div>
        <div className="col-span-3">{quantity} Item</div>
        <div className="justify-self-end">OMR {payment.subtotal}</div>
      </div>

      <div className="mt-2 grid grid-cols-5 ">
        <div className="col-span-4">Total</div>
        <div className="justify-self-end">OMR {payment.total}</div>
      </div>

      <Border />

      <div className="grid grid-cols-5 ">
        <div className="col-span-4">Paid by customer</div>
        <div className="justify-self-end">OMR {payment.amount}</div>
      </div>
    </div>
  );
}
