import React from 'react';
import {Variant} from '../../types';
import Checkbox from '../../components/forms/Checkbox';
import Button from '../../components/Button';
import VariantImage from '../../Product/Variant/components/VariantImage';
import InputText from '../../components/forms/InputText';
import Table from '../../components/Table';
import SmartTable from '../../components/SmartTable';

type ExtendedVariant = Variant & {
  isDirty: boolean;
};
interface Props {
  variants: ExtendedVariant[];
  onQuantityChange: (item: ExtendedVariant, quantity: string) => void;
  onSave: (item: ExtendedVariant) => void;
}

export default function InventoryList({variants, onQuantityChange, onSave}: Props) {
  const onCollectionClick = (item: Variant) => {
    // return Inertia.get(route('lshopify.variants.edit', [collection.id]));
  };

  return (
    <SmartTable items={variants}>
      <SmartTable.SmartHeader>
        {({selectedItemIDs}) => {
          return <></>;
        }}
      </SmartTable.SmartHeader>

      <Table>
        <SmartTable.Header>
          <Table.Header />
          <Table.Header title="Product" />
          <Table.Header title="SKU" />
          <Table.Header title="Available" />
          <Table.Header />
        </SmartTable.Header>
        <SmartTable.Body>
          {({item}) => {
            return (
              <>
                <Table.Cell>
                  {item.image && (
                    <VariantImage
                      onClick={() => onCollectionClick(item)}
                      image={item.image}
                      imageStyle="w-16 h-12"
                    />
                  )}
                </Table.Cell>
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
                <Table.Cell colStyle="w-16">
                  <InputText
                    value={item.quantity}
                    name="quantity"
                    onChange={event => onQuantityChange(item, event.target.value)}
                  />
                </Table.Cell>
                <Table.Cell colStyle="w-16">
                  {item.isDirty ? (
                    <Button onClick={() => onSave(item)} theme="success">
                      Save
                    </Button>
                  ) : null}
                </Table.Cell>
              </>
            );
          }}
        </SmartTable.Body>
      </Table>
    </SmartTable>
  );
}
