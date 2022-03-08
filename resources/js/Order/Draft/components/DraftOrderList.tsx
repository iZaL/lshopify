import React from 'react';
import {Order} from '../../../types';
import Checkbox from '../../../components/forms/Checkbox';
import Table from '../../../components/Table';
import SmartTable from '../../../components/SmartTable';

interface Props {
  orders: Order[];
  onItemClick: (order: Order) => void;
}

export default function DraftOrderList({orders, onItemClick}: Props) {
  return (
    <SmartTable items={orders}>
      <SmartTable.SmartHeader>
        {({selectedItemIDs}) => {
          return <></>;
        }}
      </SmartTable.SmartHeader>

      <Table>
        <SmartTable.Header>
          <Table.Header headerStyle="w-16" />
          <Table.Header title="Draft order" />
          <Table.Header title="Date" />
          <Table.Header title="Customer" />
          <Table.Header title="Status" />
          <Table.Header title="Total" />
        </SmartTable.Header>
        <SmartTable.Body>
          {({item}) => {
            return (
              <>
                <Table.Cell>#{item.id}</Table.Cell>
                <Table.Cell>{item.date}</Table.Cell>
                <Table.Cell>{item.customer?.first_name || '--'}</Table.Cell>
                <Table.Cell>{item.status}</Table.Cell>
                <Table.Cell>{item.total_formatted}</Table.Cell>
              </>
            );
          }}
        </SmartTable.Body>
      </Table>
    </SmartTable>
  );
}
