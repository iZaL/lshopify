import React from 'react';
import Card from '../../components/Card';
import Label from '../../components/forms/Label';
import InputText from '../../components/forms/InputText';
import Subheader from '../../components/Subheader';
import Checkbox from '../../components/forms/Checkbox';
import {Variant} from '../../types';
import Border from '../../components/Border';

interface Props {
  onChange: <T extends keyof Variant>(field: T, value: Variant[T]) => void;
  variant: Variant;
}

export default function InventorySection({onChange, variant}: Props) {
  return (
    <Card>
      <Subheader text="Inventory" />

      <div className="flex space-x-10">
        <div className="flex-1">
          <Label title="SKU (Stock Keeping Unit)" />
          <InputText
            name="sku"
            onChange={e => onChange('sku', e.target.value)}
            value={variant.sku ?? ''}
          />
        </div>

        <div className="flex-1">
          <Label title="Barcode (ISBN, UPC, GTIN, etc.)" />
          <InputText
            name="barcode"
            onChange={e => onChange('barcode', e.target.value)}
            value={variant.barcode ?? ''}
          />
        </div>
      </div>

      <Checkbox
        name="track_quantity"
        label="Track Quantity"
        checked={variant.track_quantity}
        onChange={e => onChange('track_quantity', e.target.checked)}
      />

      {variant.track_quantity && (
        <div>
          <Checkbox
            name="out_of_stock_sale"
            label="Continue selling when out of stock"
            checked={variant.out_of_stock_sale}
            onChange={e => onChange('out_of_stock_sale', e.target.checked)}
          />

          <Border />

          <div className="min-w-0 flex-1">
            <Subheader text="QUANTITY" headerStyle="text-sm" />
          </div>

          <div className="flex ">
            <div className="w-1/2 pr-5">
              <Label title="Available" />
              <InputText
                name="quantity"
                onChange={e => onChange('quantity', e.target.value)}
                value={variant.quantity}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
