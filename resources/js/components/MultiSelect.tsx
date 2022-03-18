import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { Tag } from '../types'
import Loader from './Loader'

interface Props {
  selectedItems: Tag[];
  items: Tag[];
  isLoading?: boolean;
  onChange: (collection: Tag[]) => void;
  onCreate: (value: string) => void;
}

export default function MultiSelect({
  selectedItems,
  items,
  onChange,
  isLoading = false,
  onCreate,
}: Props) {
  const onTagsChange = (tags: any) => {
    const newTags = tags.map((option: {label: string; value: string}) => {
      return {
        id: option.value,
        name: option.label,
      };
    });
    onChange(newTags);
  };

  return (
    <>
      <CreatableSelect
        isMulti
        className="basic-multi-select text-sm"
        classNamePrefix="select"
        onChange={onTagsChange}
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
    </>
  );
}
