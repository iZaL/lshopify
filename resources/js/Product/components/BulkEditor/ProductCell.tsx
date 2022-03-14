import {Product} from '../../../types';
import Select from '../../../components/forms/Select';
import InputText from '../../../components/forms/InputText';
import React from 'react';
import VariantImage from '../../Variant/components/VariantImage';

export default function ProductCell({
  product,
  attribute,
  onChange,
}: {
  product: Product;
  attribute: keyof Product;
  onChange: (value: string) => void;
}) {
  if (attribute === 'tags') {
    return null;
  }

  if (attribute === 'status') {
    return (
      <Select
        name="status"
        onChange={e => onChange(e.target.value)}
        value={product['status']}
        inputStyle="rounded-none shadow-none border-none focus:rounded-none min-w-[150px]">
        <option value="draft">Draft</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </Select>
    );
  }

  if (attribute === 'title') {
    return (
      <div className="inline-flex items-center">
        <VariantImage
          image={product.image}
          onClick={() => {}}
          imageStyle="h-10 ml-2"
          border={false}
        />
        <InputText
          name={attribute}
          value={product['title']}
          onChange={e => onChange(e.target.value)}
          inputStyle="min-w-[280px] rounded-none shadow-none border-none focus:rounded-none "
        />
      </div>
    );
  }

  return null;
}
