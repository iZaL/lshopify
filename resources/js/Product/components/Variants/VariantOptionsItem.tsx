import React from 'react';
import CreatableSelect from 'react-select/creatable';
import {VariantOption} from '../../../types';
import Button from '../../../components/Button';

interface Props {
  iteration: number;
  showRemoveItemButton: boolean;
  variants: VariantOption[];
  variant: VariantOption;
  onVariantRemove: (variant: VariantOption) => void;
  onVariantChange: (variant: VariantOption, value: any) => void;
  onVariantOptionsChange: (variant: VariantOption, values: any) => void;
}

export default function VariantOptionsItem({
  variants,
  iteration,
  onVariantChange,
  variant,
  onVariantOptionsChange,
  onVariantRemove,
  showRemoveItemButton,
}: Props) {
  return (
    <>
      <div className='flex flex-row justify-between'>
        <div className='text-sm font-semi-bold'>Option {iteration}</div>
        {showRemoveItemButton && (
          <Button onClick={() => (variant ? onVariantRemove(variant) : null)}>
            <div className='text-blue-700 text-sm'>Remove</div>
          </Button>
        )}
      </div>

      <div className='grid grid-cols-3 gap-5 pb-5 pt-2 '>
        <div className='md:col-span-1 text-sm'>
          <CreatableSelect
            className='basic-multi-select'
            classNamePrefix='select'
            onChange={(option) =>
              onVariantChange(variant, {
                id: option?.value,
                name: option?.label,
              })
            }
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            noOptionsMessage={() => null}
            options={variants.map(({id, name}) => ({
              value: id,
              label: name,
            }))}
            value={{value: variant.id, label: variant.name}}
          />
        </div>
        <div className='md:col-span-2'>
          <CreatableSelect
            isMulti
            className='basic-multi-select'
            classNamePrefix='select'
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            noOptionsMessage={() => null}
            isClearable={false}
            placeholder={'select options'}
            value={variant.options?.map(({id, name}) => ({
              value: id,
              label: name,
            }))}
            onChange={(values) =>
              onVariantOptionsChange(
                variant,
                values.map((value) => ({id: value.value, name: value.label}))
              )
            }
          />
        </div>
      </div>
    </>
  );
}
