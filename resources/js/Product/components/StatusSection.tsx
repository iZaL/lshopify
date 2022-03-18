import React from 'react';
import Card from '../../components/Card';
import Subheader from '../../components/Subheader';
import Checkbox from '../../components/forms/Checkbox';
import {Product, ProductStatus} from '../../types';
import Select from '../../components/forms/Select';
import Border from '../../components/Border';

interface Props {
  onChange: (field: keyof Product, value: any) => void;
  activeStatus: ProductStatus;
}

export default function StatusSection({onChange, activeStatus}: Props) {
  return (
    <Card>
      <Subheader text={'Product Status'} />

      <div className="mt-1 sm:mt-0">
        <Select
          name="status"
          onChange={e => onChange('status', e.target.value)}
          value={activeStatus}>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
        </Select>
      </div>

      <div className="mb-4 block text-sm text-gray-500">
        This product will be available to 1 sales channel.
      </div>

      <Border />

      <Subheader text={'SALES CHANNELS AND APPS'} headerStyle={'text-xs'} />
      <Checkbox
        label="Online Store"
        name="online_store"
        checked={false}
        onChange={() => {}}
      />
    </Card>
  );
}
