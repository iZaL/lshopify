import {Product} from '../../../types';
import Select from '../../../components/forms/Select';
import InputText from '../../../components/forms/InputText';
import React from 'react';

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
        // product,attribute,
        value={product['status']}
        inputStyle="rounded-none border-none">
        <option value="draft">Draft</option>
        <option value="active">Active</option>
        <option value="archived">Archived</option>
      </Select>
    );
  }

  if (attribute === 'title') {
    return (
      <InputText
        name={attribute}
        value={product['title']}
        onChange={e => onChange(e.target.value)}
        // onChange={e => onChange(product, attribute, e.target.value)}
        inputStyle="rounded-none border-none"
      />
    );
  }

  return null;
}
