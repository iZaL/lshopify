import React from 'react';
import {Variant} from '../../types';
import Checkbox from '../../components/forms/Checkbox';
import Button from '../../components/Button';
import VariantImage from '../../Product/Variant/components/VariantImage';
import InputText from '../../components/forms/InputText';
import Table from '../../components/Table';

type ExtendedVariant = Variant & {
  isDirty: boolean;
};
interface Props {
  variants: ExtendedVariant[];
  onQuantityChange: (variant: ExtendedVariant, quantity: string) => void;
  onSave: (variant: ExtendedVariant) => void;
}

export default function InventoryList({
  variants,
  onQuantityChange,
  onSave,
}: Props) {

  const onCollectionClick = (variant: Variant) => {
    // return Inertia.get(route('lshopify.variants.edit', [collection.id]));
  };

  return (
    <Table>
      <thead>
        <tr>
          <Table.Head />
          <Table.Head />
          <Table.Head title="Product" />
          <Table.Head title="SKU" />
          <Table.Head title="Available" />
          <Table.Head />
        </tr>
      </thead>
      <tbody>
        {variants.map((variant, id) => (
          <Table.Row key={id} idx={id} onClick={()=>{}}>
            <Table.Col>
              <div className="flex w-12 items-center justify-center">
                <Checkbox checked={false} onChange={() => {}} name="" />
              </div>
            </Table.Col>
            <Table.Col>
              {variant.image && (
                <VariantImage
                  onClick={() => onCollectionClick(variant)}
                  image={variant.image}
                  imageStyle="w-16 h-12"
                />
              )}
            </Table.Col>
            <Table.Col>
              {variant.product?.title && (
                <span className="font-bold">
                  {variant.product.title}
                  <br />
                </span>
              )}
              {variant.title}
            </Table.Col>
            <Table.Col>{variant.sku}</Table.Col>
            <Table.Col colStyle='w-16'>
              <InputText
                value={variant.quantity}
                name="quantity"
                onChange={event =>
                  onQuantityChange(variant, event.target.value)
                }
              />
            </Table.Col>
            <Table.Col colStyle='w-16'>
              {variant.isDirty ? (
                  <Button onClick={() => onSave(variant)} theme="success">
                    Save
                  </Button>
              ) : null}
            </Table.Col>
          </Table.Row>
        ))}
      </tbody>
    </Table>
  );
}
