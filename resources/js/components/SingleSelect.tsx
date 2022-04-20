import React from 'react';
import {SingleValue} from 'react-select';
import CreatableSelect from 'react-select/creatable';

import Loader from './Loader';

type Item = {
  id: string;
  name: string;
};

interface Props<T> {
  items: T[];
  selectedItem: T | null;
  onChange: (record: T) => void;
  onCreate: (value: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function SingleSelect({
  items,
  selectedItem,
  onCreate,
  onChange,
  isLoading = false,
  placeholder = 'e.g. Shirts',
}: Props<Item>) {
  const onInputChange = (
    option: SingleValue<{value: string | undefined; label: string | undefined}>,
  ) => {
    if (option && option.value && option.label) {
      onChange({
        id: option.value,
        name: option.label,
      });
    }
  };

  return (
    <CreatableSelect
      options={items.map(({id, name}) => ({
        value: id,
        label: name,
      }))}
      value={{value: selectedItem?.id, label: selectedItem?.name}}
      classNamePrefix="select"
      onChange={option => onInputChange(option)}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
        LoadingIndicator: () => Loader(),
      }}
      isLoading={isLoading}
      noOptionsMessage={() => null}
      placeholder={placeholder}
      isClearable
      onCreateOption={value => onCreate(value)}
    />
  );
}
