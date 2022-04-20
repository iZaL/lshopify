import React from 'react';

import Button from '../../components/Button';
import InputText from '../../components/forms/InputText';
import SmartTable from '../../components/SmartTable';
import Table from '../../components/Table';
import {Variant} from '../../types';

type ExtendedVariant = Variant & {
  isDirty: boolean;
};
interface Props {
  variants: ExtendedVariant[];
  onQuantityChange: (item: ExtendedVariant, quantity: string) => void;
  onSave: (item: ExtendedVariant) => void;
}

export default function InventoryList({
  variants,
  onQuantityChange,
  onSave,
}: Props) {

  return (
    <SmartTable items={variants}>
      <SmartTable.SmartHeader>
        {({selectedItemIDs}) => <></>}
      </SmartTable.SmartHeader>

      <Table>
        <SmartTable.Header>
          <Table.Header title="Product" />
          <Table.Header title="SKU" />
          <Table.Header title="Available" />
          <Table.Header />
        </SmartTable.Header>
        <SmartTable.Body>
          {({item}) => (
            <>
              <Table.Cell>
                {item.product?.title && (
                  <span className="font-bold">
                    {item.product.title}
                    <br />
                  </span>
                )}
                {item.title}
              </Table.Cell>
              <Table.Cell>{item.sku}</Table.Cell>
              <Table.Cell cellStyle="w-16">
                <InputText
                  value={item.quantity}
                  name="quantity"
                  onChange={event => onQuantityChange(item, event.target.value)}
                />
              </Table.Cell>
              <Table.Cell cellStyle="w-16">
                {item.isDirty ? (
                  <Button onClick={() => onSave(item)} theme="success">
                    Save
                  </Button>
                ) : null}
              </Table.Cell>
            </>
          )}
        </SmartTable.Body>
      </Table>
    </SmartTable>
  );
}
