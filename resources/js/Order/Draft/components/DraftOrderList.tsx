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
          <Table.Head headerStyle="w-16" />
          <Table.Head title="Draft order" />
          <Table.Head title="Date" />
          <Table.Head title="Customer" />
          <Table.Head title="Status" />
          <Table.Head title="Total" />
        </SmartTable.Header>
        <SmartTable.Body>
          {({item}) => {
            return (
              <>
                <Table.Col>#{item.id}</Table.Col>
                <Table.Col>{item.date}</Table.Col>
                <Table.Col>{item.customer?.first_name || '--'}</Table.Col>
                <Table.Col>{item.status}</Table.Col>
                <Table.Col>{item.total_formatted}</Table.Col>
              </>
            );
          }}
        </SmartTable.Body>
      </Table>
    </SmartTable>
  );
}
