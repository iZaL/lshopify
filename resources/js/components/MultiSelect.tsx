import React from 'react';
import {MultiValue} from 'react-select';
import CreatableSelect from 'react-select/creatable';

import Loader from './Loader';

type Item = {
  id: string;
  name: string;
};

interface Props<T> {
  selectedItems: T[];
  items: T[];
  isLoading?: boolean;
  onChange: (collection: Item[]) => void;
  onCreate: (value: string) => void;
}

export default function MultiSelect<T extends Item>({
  selectedItems,
  items,
  isLoading = false,
  onChange,
  onCreate,
}: Props<T>) {
  const onItemsChange = (tags: MultiValue<{label: string; value: string}>) => {
    const newTags: Item[] = tags.map(({value, label}) => ({
      id: value,
      name: label,
    }));
    onChange(newTags);
  };

  return (
    <CreatableSelect
      isMulti
      className="basic-multi-select text-sm"
      classNamePrefix="select"
      onChange={onItemsChange}
      components={{
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
        LoadingIndicator: () => Loader(),
      }}
      isLoading={isLoading}
      noOptionsMessage={() => null}
      options={items.map(({id, name}) => ({
        value: id,
        label: name,
      }))}
      value={selectedItems.map(({id, name}) => ({
        value: id,
        label: name,
      }))}
      onCreateOption={value => onCreate(value)}
    />
  );
}
