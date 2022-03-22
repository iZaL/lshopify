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
  onVariantOptionChange: (variant: VariantOption, value: any) => void;
  onVariantValuesChange: (variant: VariantOption, values: any) => void;
}

export default function VariantOptionsItem({
  variants,
  iteration,
  onVariantOptionChange,
  variant,
  onVariantValuesChange,
  onVariantRemove,
  showRemoveItemButton,
}: Props) {
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="font-semi-bold text-sm">VariantOption {iteration}</div>
        {showRemoveItemButton && (
          <Button
            onClick={() => (variant ? onVariantRemove(variant) : null)}
            theme="clear">
            <div className="text-sm text-blue-700">Remove</div>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-5 pb-4">
        <div className="text-sm md:col-span-1">
          <CreatableSelect
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={option =>
              onVariantOptionChange(variant, {
                id: option?.value,
                name: option?.label,
              })
            }
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            noOptionsMessage={() => null}
            options={variants.map(({name, id}) => ({
              value: name,
              label: id,
            }))}
            value={{value: variant.name, label: variant.id}}
          />
        </div>
        <div className="md:col-span-2">
          <CreatableSelect
            isMulti
            className="basic-multi-select"
            classNamePrefix="select"
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            noOptionsMessage={() => null}
            isClearable={false}
            placeholder={'select options'}
            value={variant.values?.map(({name, id}) => ({
              value: name,
              label: id,
            }))}
            onChange={values =>
              onVariantValuesChange(
                variant,
                values.map(value => ({id: value.value, name: value.label})),
              )
            }
          />
        </div>
      </div>
    </>
  );
}
