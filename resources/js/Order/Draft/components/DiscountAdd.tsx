import React, {ReactElement, useState} from 'react';

import InputText from '../../../components/forms/InputText';
import Label from '../../../components/forms/Label';
import Select from '../../../components/forms/Select';
import {Discount} from '../../../types';
// import {CartDiscount} from '../../../types';

type Props = {
  discount: Discount;
  children: (discount: Discount) => ReactElement;
};

export default function DiscountAdd({discount, children}: Props) {
  const [discountAttributes, setDiscountAttributes] = useState<Discount>(discount);
  console.log('di',discountAttributes);
  // const [discountAttributes, setDiscountAttributes] = useState<Discount>({
    // value_type: discount?.value_type || 'fixed_amount',
    // value: discount?.value || '0',
    // reason: discount?.reason || '',
  // });

  const setAttributes = <T extends keyof Discount>(field: T, value: Discount[T]) => {
    setDiscountAttributes({
      ...discountAttributes,
      [field]: value,
    });
  };

  return (
    <div className="">
      <div className="p-5">
        <div className="flex space-x-4">
          <div className="flex-1">
            <Label title="Discount type" />
            <Select
              name="value_type"
              onChange={e => setAttributes('value_type', e.target.value === 'percentage' ? 'percentage' : 'fixed_amount')}
              value={discountAttributes?.value_type}>
              <option value="amount">Amount</option>
              <option value="percentage">Percentage</option>
            </Select>
          </div>
          <div className="flex-1">
            <Label title="Discount value" />
            <InputText
              name="value"
              onChange={e => setAttributes('value', e.target.value)}
              leftComponent={
                discountAttributes?.value_type === 'fixed_amount' ? (
                  <div className="text-md text-sm text-gray-400">OMR</div>
                ) : null
              }
              rightComponent={
                discountAttributes?.value_type === 'percentage' ? (
                  <div className="text-md text-sm text-gray-400">%</div>
                ) : null
              }
              inputStyle={discountAttributes?.value_type === 'fixed_amount' ? 'pl-14' : ''}
              placeholder={
                discountAttributes?.value_type === 'fixed_amount' ? '0.00' : '0'
              }
              value={discountAttributes?.value}
            />
          </div>
        </div>

        <div className="mt-5">
          <Label title="Reason" />
          <InputText
            name="reason"
            placeholder="Reason"
            onChange={e => setAttributes('reason', e.target.value)}
            value={discountAttributes?.reason}
          />
        </div>
      </div>

      {children(discountAttributes)}

    </div>
  );
}
