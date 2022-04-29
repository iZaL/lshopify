import React from 'react';

import SmartTable from '../../../components/SmartTable';
import Table from '../../../components/Table';
import {Order} from '../../../types';

interface Props {
  orders: Order[];
  onItemClick: (order: Order) => void;
}

export default function DraftOrderList({orders, onItemClick}: Props) {
  return (
    <SmartTable items={orders}>
      <SmartTable.SmartHeader>{() => <></>}</SmartTable.SmartHeader>

      <Table>
        <SmartTable.Header>
          <Table.Header title="Draft order" />
          <Table.Header title="Date" />
          <Table.Header title="Customer" />
          <Table.Header title="Status" />
          <Table.Header title="Total" />
        </SmartTable.Header>
        <SmartTable.Body onItemClick={onItemClick}>
          {({item}) => (
            <>
              <Table.Cell>#{item.id}</Table.Cell>
              <Table.Cell>{item.date}</Table.Cell>
              <Table.Cell>{item.customer?.first_name || '--'}</Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
              <Table.Cell>{item.total_formatted}</Table.Cell>
            </>
          )}
        </SmartTable.Body>
      </Table>
    </SmartTable>
  );
}
