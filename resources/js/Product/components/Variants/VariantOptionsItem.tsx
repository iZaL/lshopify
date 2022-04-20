import React from 'react';
import CreatableSelect from 'react-select/creatable';

import Button from '../../../components/Button';
import {VariantOption} from '../../../types';

interface Props {
  iteration: number;
  showRemoveOptionButton: boolean;
  variantOption: VariantOption;
  pendingVariantOptions: VariantOption[];
  onVariantOptionRemove: (variant: VariantOption) => void;
  onVariantOptionChange: (variant: VariantOption, value: any) => void;
  onVariantValuesChange: (variant: VariantOption, values: any) => void;
}

export default function VariantOptionsItem({
  iteration,
  variantOption,
  showRemoveOptionButton,
  pendingVariantOptions,
  onVariantOptionChange,
  onVariantValuesChange,
  onVariantOptionRemove,
}: Props) {
  return (
    <>
      <div className="flex flex-row justify-between">
        <div className="font-semi-bold text-sm">VariantOption {iteration}</div>
        {showRemoveOptionButton && (
          <Button
            onClick={() =>
              variantOption ? onVariantOptionRemove(variantOption) : null
            }
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
              onVariantOptionChange(variantOption, {
                id: option?.value,
                name: option?.label,
              })
            }
            components={{
              DropdownIndicator: () => null,
              IndicatorSeparator: () => null,
            }}
            noOptionsMessage={() => null}
            options={pendingVariantOptions.map(({name, id}) => ({
              label: name,
              value: id,
            }))}
            value={{label: variantOption.name, value: variantOption.id}}
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
            placeholder="select options"
            value={variantOption.values?.map(({name, id}) => ({
              value: id,
              label: name,
            }))}
            onChange={values =>
              onVariantValuesChange(
                variantOption,
                values.map(value => ({id: value.value, name: value.label})),
              )
            }
          />
        </div>
      </div>
    </>
  );
}
