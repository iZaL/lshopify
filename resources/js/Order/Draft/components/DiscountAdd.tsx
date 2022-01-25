import React, {ReactElement, useState} from 'react';
import Label from '../../../components/forms/Label';
import Select from '../../../components/forms/Select';
import InputText from '../../../components/forms/InputText';
import {CartDiscount} from '../../../types';

type Props = CartDiscount & {
  discount: CartDiscount | null;
  children: ({suffix, value, reason}: CartDiscount) => ReactElement;
};

export default function DiscountAdd({discount, children}: Props) {
  const [discountAttributes, setDiscountAttributes] = useState<CartDiscount>({
    suffix: discount?.suffix || 'amount',
    value: discount?.value || '0',
    reason: discount?.reason || '',
  });

  const setAttributes = (field: string, value: string) => {
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
              name="suffix"
              onChange={e => setAttributes('suffix', e.target.value)}
              value={discountAttributes.suffix}>
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
                discountAttributes.suffix === 'amount' ? (
                  <div className="text-md text-sm text-gray-400">OMR</div>
                ) : null
              }
              rightComponent={
                discountAttributes.suffix === 'percentage' ? (
                  <div className="text-md text-sm text-gray-400">%</div>
                ) : null
              }
              inputStyle={discountAttributes.suffix === 'amount' ? 'pl-14' : ''}
              placeholder={
                discountAttributes.suffix === 'amount' ? '0.00' : '0'
              }
              value={discountAttributes.value}
            />
          </div>
        </div>

        <div className="mt-5">
          <Label title="Reason" />
          <InputText
            name="reason"
            placeholder="Reason"
            onChange={e => setAttributes('reason', e.target.value)}
            value={discountAttributes.reason}
          />
        </div>
      </div>

      {children(discountAttributes)}
    </div>
  );
}
