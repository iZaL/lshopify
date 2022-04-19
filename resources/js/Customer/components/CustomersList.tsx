import {Inertia} from '@inertiajs/inertia';
import React from 'react';
import route from 'ziggy-js';
import Button from '../../components/Button';
import DropdownButton from '../../components/DropdownButton';
import SmartTable from '../../components/SmartTable';
import Table from '../../components/Table';
import {Customer} from '../../types';

interface Props {
  customers: Customer[];
}

export default function CustomersList({customers}: Props) {
  return (
    <SmartTable items={customers}>
      <SmartTable.SmartHeader>
        {({selectedItemIDs}) => (
          <>
            <Button
              theme="clear"
              buttonStyle="-ml-px px-2 border border-gray-300 font-medium"
              onClick={() =>
                Inertia.get(route('lshopify.products.bulk_editor.index'), {
                  product_ids: selectedItemIDs,
                })
              }>
              Edit products
            </Button>

            <DropdownButton
              buttonTitle="More actions"
              arrowVisible
              buttonProps={{
                theme: 'clear',
                buttonStyle:
                  '-ml-px px-2 border border-gray-300 rounded-r-md h-10 font-medium',
              }}
              items={[
                {
                  title: 'Set as active',
                  onClick: () => {},
                },
                {
                  title: 'Set as draft',
                  onClick: () => {},
                  // showDialogBox({
                  //   ...modalParams,
                  //   title: `Set ${selectedItemIDs.length} products as draft?`,
                  //   body: 'Setting products as draft will hide them from all sales channels and apps.',
                  //   submitButtonTitle: 'Set as draft',
                  //   onSubmit: () => {
                  //     setShowDialog(false);
                  //     onUpdate(selectedItemIDs, 'status', 'draft');
                  //   },
                  // }),
                },
                {
                  title: 'Archive products',
                  onClick: () => {},
                },
                {
                  title: 'Delete products',
                  onClick: () => {},
                },
                {
                  title: 'Add tags',
                  onClick: () => {},
                },
                {
                  title: 'Add to collection',
                  onClick: () => {},
                },
                {
                  title: 'Remove from collection',
                  onClick: () => {},
                },
              ]}
            />
          </>
        )}
      </SmartTable.SmartHeader>

      <Table>
        <SmartTable.Header>
          <Table.Header title="Customer name" />
          <Table.Header title="Status" />
          <Table.Header title="Location" />
          <Table.Header title="Orders" />
          <Table.Header title="Spent" />
        </SmartTable.Header>
        <SmartTable.Body onItemClick={() => {}}>
          {({item}) => (
            <>
              <Table.Cell>
                <Button theme="clear" onClick={() => {}}>
                  <span className="text-left font-medium">
                    {item.full_name}
                  </span>
                </Button>
              </Table.Cell>
              <Table.Cell cellStyle="capitalize" />
              <Table.Cell>{item.location}</Table.Cell>
              <Table.Cell>{item.orders_count} orders</Table.Cell>
              <Table.Cell />
            </>
          )}
        </SmartTable.Body>
      </Table>
    </SmartTable>
  );
}
