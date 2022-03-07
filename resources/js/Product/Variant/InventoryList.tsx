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

export default function InventoryList({
  variants,
  onQuantityChange,
  onSave,
}: Props) {
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
          <Table.Head />
          <Table.Head title="Product" />
          <Table.Head title="SKU" />
          <Table.Head title="Available" />
          <Table.Head />
        </SmartTable.Header>
        <SmartTable.Body>
          {({item}) => {
            return (
              <>
                <Table.Col>
                  {item.image && (
                    <VariantImage
                      onClick={() => onCollectionClick(item)}
                      image={item.image}
                      imageStyle="w-16 h-12"
                    />
                  )}
                </Table.Col>
                <Table.Col>
                  {item.product?.title && (
                    <span className="font-bold">
                      {item.product.title}
                      <br />
                    </span>
                  )}
                  {item.title}
                </Table.Col>
                <Table.Col>{item.sku}</Table.Col>
                <Table.Col colStyle="w-16">
                  <InputText
                    value={item.quantity}
                    name="quantity"
                    onChange={event =>
                      onQuantityChange(item, event.target.value)
                    }
                  />
                </Table.Col>
                <Table.Col colStyle="w-16">
                  {item.isDirty ? (
                    <Button onClick={() => onSave(item)} theme="success">
                      Save
                    </Button>
                  ) : null}
                </Table.Col>
              </>
            );
          }}
        </SmartTable.Body>
      </Table>
    </SmartTable>
  );
}
