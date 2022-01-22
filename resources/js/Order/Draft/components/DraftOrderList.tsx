import React from 'react';
import {Order} from '../../../types';

interface Props {
  orders: Order[];
  onItemClick: (order: Order) => void;
}

export default function DraftOrderList({orders, onItemClick}: Props) {
  return (
    <ul className="p-4">
      {orders.map((order, i) => {
        return (
          <li key={i} onClick={() => onItemClick(order)}>
            {order.id} - {order.total} OMR
          </li>
        );
      })}
    </ul>
  );
}
