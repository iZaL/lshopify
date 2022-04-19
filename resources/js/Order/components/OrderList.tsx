import React from 'react';
import SmartTable from '../../components/SmartTable';
import Table from '../../components/Table';
import {Order} from '../../types';

interface Props {
  orders: Order[];
  onItemClick: (order: Order) => void;
}

export default function OrderList({orders, onItemClick}: Props) {
  return (
    <SmartTable items={orders}>
      <SmartTable.SmartHeader>
        {({selectedItemIDs}) => <></>}
      </SmartTable.SmartHeader>

      <Table>
        <SmartTable.Header>
          <Table.Header title="Order" />
          <Table.Header title="Date" />
          <Table.Header title="Customer" />
          <Table.Header title="Total" />
          <Table.Header title="Payment status" />
          <Table.Header title="Fulfillment status" />
          <Table.Header title="Items" />
          <Table.Header title="Delivery method" />
          <Table.Header title="Tags" />
        </SmartTable.Header>
        <SmartTable.Body onItemClick={onItemClick}>
          {({item}) => (
              <>
                <Table.Cell>#{item.id}</Table.Cell>
                <Table.Cell>{item.date_time}</Table.Cell>
                <Table.Cell>{item.customer?.first_name || '--'}</Table.Cell>
                <Table.Cell>{item.total_formatted}</Table.Cell>
                <Table.Cell>{item.payment_status}</Table.Cell>
                <Table.Cell>{item.fulfillment_status}</Table.Cell>
                <Table.Cell>{item.items_count}</Table.Cell>
                <Table.Cell />
                <Table.Cell />
              </>
            )}
        </SmartTable.Body>
      </Table>
    </SmartTable>
  );
}
