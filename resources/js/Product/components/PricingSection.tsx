import React from 'react';
import Card from '../../components/Card';
import Label from '../../components/forms/Label';
import InputText from '../../components/forms/InputText';
import Subheader from '../../components/Subheader';
import Checkbox from '../../components/forms/Checkbox';
import {Variant} from '../../types';

interface Props {
  onChange: (field: keyof Variant, value: any) => void;
  variant: Variant;
}

export default function PricingSection({onChange, variant}: Props) {
  return (
    <Card>
      <Subheader text='Pricing' />

      <div className='flex space-x-10'>
        <div className='flex-1'>
          <Label title='Price' />
          <InputText
            name='price'
            onChange={(e) => onChange('price', e.target.value)}
            leftComponent={
              <div className='text-md text-gray-400 text-sm'>OMR</div>
            }
            style='pl-14'
            placeholder='0.00'
            value={variant.price}
          />
        </div>

        <div className='flex-1'>
          <Label title='Compare at Price' />
          <InputText
            name='compare_at_price'
            onChange={(e) => onChange('compare_at_price', e.target.value)}
            leftComponent={
              <div className='text-md text-gray-400 text-sm'>OMR</div>
            }
            style='pl-14'
            placeholder='0.00'
            value={variant.compare_at_price}
          />
        </div>
      </div>

      <div className='flex space-x-10'>
        <div className=' flex-1'>
          <Label title='Cost per item' />
          <InputText
            name='cost_price'
            onChange={(e) => onChange('cost_price', e.target.value)}
            leftComponent={
              <div className='text-md text-gray-400 text-sm'>OMR</div>
            }
            style='pl-14'
            placeholder='0.00'
            value={variant.cost_price}
          />
          <p className='block text-sm text-gray-500 py-1'>
            Customers wont see this
          </p>
        </div>

        <div className='flex-1'>
          <div className='flex'>
            <div className='flex-1'>
              <label className='block text-sm text-gray-500'>Margin</label>
              <span>-</span>
            </div>

            <div className='flex-1'>
              <label className='block text-sm text-gray-500'>Profit</label>
              <span>-</span>
            </div>
          </div>
        </div>
      </div>

      <Checkbox
        name='taxable'
        label='Charge tax on this product'
        checked={variant.taxable}
        onChange={(e) => onChange('taxable', e.target.checked)}
      />
    </Card>
  );
}
