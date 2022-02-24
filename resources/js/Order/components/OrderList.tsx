import React from 'react';
import {Order} from '../../types';
import Checkbox from '../../components/forms/Checkbox';
import Table from '../../components/Table';

interface Props {
  orders: Order[];
  onItemClick: (order: Order) => void;
}

export default function OrderList({orders, onItemClick}: Props) {
  return (
    <Table>
      <thead>
        <Table.Row>
          <Table.Head headerStyle="w-16" />
          <Table.Head title="Order" />
          <Table.Head title="Date" />
          <Table.Head title="Customer" />
          <Table.Head title="Total" />
          <Table.Head title="Payment status" />
          <Table.Head title="Fulfillment status" />
          <Table.Head title="Items" />
          <Table.Head title="Delivery method" />
          <Table.Head title="Tags" />
        </Table.Row>
      </thead>
      <tbody>
        {orders.map((order, id) => (
          <Table.Row key={id} idx={id} onClick={() => onItemClick(order)}>
            <Table.Col>
              <div className="flex w-12 items-center justify-center">
                <Checkbox checked={false} onChange={() => {}} name="" />
              </div>
            </Table.Col>
            <Table.Col>#{order.id}</Table.Col>
            <Table.Col>{order.date_time}</Table.Col>
            <Table.Col>{order.customer?.first_name || '--'}</Table.Col>
            <Table.Col>{order.total_formatted}</Table.Col>
            <Table.Col>{order.payment_status}</Table.Col>
            <Table.Col>{order.fulfillment_status}</Table.Col>
            <Table.Col>{order.items_count}</Table.Col>
            <Table.Col></Table.Col>
            <Table.Col></Table.Col>
            {/*<Table.Col>{order.delivery_method}</Table.Col>*/}
            {/*<Table.Col>{order.tags}</Table.Col>*/}
          </Table.Row>
        ))}
      </tbody>
    </Table>
  );
}
