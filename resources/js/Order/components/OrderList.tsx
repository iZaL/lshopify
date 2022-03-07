import React from 'react';
import {Order} from '../../types';
import Checkbox from '../../components/forms/Checkbox';
import Table from '../../components/Table';
import SmartTable from '../../components/SmartTable';

interface Props {
  orders: Order[];
  onItemClick: (order: Order) => void;
}

export default function OrderList({orders, onItemClick}: Props) {
  return (
    <SmartTable items={orders}>
      <SmartTable.SmartHeader>
        {({selectedItemIDs}) => {
          return <></>;
        }}
      </SmartTable.SmartHeader>

      <Table>
        <SmartTable.Header>
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
        </SmartTable.Header>
        <SmartTable.Body>
          {({item}) => {
            return (
              <>
                <Table.Col>#{item.id}</Table.Col>
                <Table.Col>{item.date_time}</Table.Col>
                <Table.Col>{item.customer?.first_name || '--'}</Table.Col>
                <Table.Col>{item.total_formatted}</Table.Col>
                <Table.Col>{item.payment_status}</Table.Col>
                <Table.Col>{item.fulfillment_status}</Table.Col>
                <Table.Col>{item.items_count}</Table.Col>
                <Table.Col></Table.Col>
                <Table.Col></Table.Col>
              </>
            );
          }}
        </SmartTable.Body>
      </Table>
    </SmartTable>
  );
}
