import React from 'react'
import { ProductType } from '../../types'
import CreatableSelect from 'react-select/creatable'
import Loader from '../../components/Loader'

interface Props {
  items: ProductType[];
  selectedItem: ProductType | null;
  onChange: (record: ProductType) => void;
  onCreate: (value: string) => void;
  isLoading: boolean;
}

export default function ProductTypeSelect({
  items,
  selectedItem,
  onCreate,
  onChange,
  isLoading = false,
}: Props) {
  return (
    <CreatableSelect
      options={items.map(({id, name}) => ({
        value: id,
        label: name,
      }))}
      value={{value: selectedItem?.id, label: selectedItem?.name}}
      classNamePrefix="select"
      onChange={option =>
        onChange({id: option?.value || '', name: option?.label || ''})
      }
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
        LoadingIndicator: () => Loader(),
      }}
      isLoading={isLoading}
      noOptionsMessage={() => null}
      placeholder="e.g. Shirts"
      isClearable={true}
      onCreateOption={value => onCreate(value)}
    />
  );
}
