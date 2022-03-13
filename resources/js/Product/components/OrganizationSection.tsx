import React, {useState} from 'react';
import Card from '../../components/Card';
import Subheader from '../../components/Subheader';
import Border from '../../components/Border';
import Label from '../../components/forms/Label';
import InputText from '../../components/forms/InputText';
import CreatableSelect from 'react-select/creatable';
import {Collection, ProductType, Tag} from '../../types';
import SearchIcon from '@heroicons/react/outline/SearchIcon';
import CollectionMenu from './CollectionMenu';
import OutsideClickHandler from '../../components/OutsideClickHandler';
import Loader from '../../components/Loader';
import Button from '../../components/Button';

interface Props {
  productTypes: ProductType[];
  productType: ProductType | null;
  defaultTags: Tag[];
  tags: Tag[];
  collection: Collection[];
  defaultCollection: Collection[];
  setTags: (collection: Tag[]) => void;
  setCollection: (collection: Collection[]) => void;
  onProductTypeChange: (record: ProductType) => void;
  onProductTypeCreate: (value: string) => void;
  isProductTypeLoading?: boolean;
  isTagsLoading?: boolean;
  onTagsCreate: (value: string) => void;
}

export default function OrganizationSection({
  productType,
  productTypes,
  onProductTypeChange,
  onProductTypeCreate,
  defaultTags,
  tags,
  setTags,
  collection,
  defaultCollection,
  setCollection,
  isProductTypeLoading = false,
  isTagsLoading = false,
  onTagsCreate,
}: Props) {
  const [showCollectionMenu, setShowCollectionMenu] = useState(false);

  const onCollectionChange = (collectionItem: Collection, checked: boolean) => {
    let newCollection;
    if (checked) {
      newCollection = [...collection, collectionItem];
    } else {
      newCollection = collection.filter(item => item.id !== collectionItem.id);
    }
    setCollection(newCollection);
  };

  const onTagsChange = (tgs: any) => {
    const newTags = tgs.map((option: {label: string; value: string}) => {
      return {
        id: option.value,
        name: option.label,
      };
    });
    setTags(newTags);
  };

  const onProductChange = (types: any) => {
    onProductTypeChange(types);
  };

  return (
    <Card>
      <Subheader text={'Organization'} />

      <div className="mt-1 py-2 text-sm sm:col-span-2 sm:mt-0">
        <Label title="Product Type" labelStyle="mb-1" />
        <CreatableSelect
          options={productTypes.map(({id, name}) => ({
            value: id,
            label: name,
          }))}
          value={{value: productType?.id, label: productType?.name}}
          classNamePrefix="select"
          onChange={option => onProductChange({id: option?.value, name: option?.label})}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
            LoadingIndicator: () => Loader(),
          }}
          isLoading={isProductTypeLoading}
          noOptionsMessage={() => null}
          placeholder="e.g. Shirts"
          isClearable={true}
          onCreateOption={value => onProductTypeCreate(value)}
        />
      </div>

      <Border />

      <Subheader text={'COLLECTIONS'} headerStyle={'text-xs'} />

      <div className="text-sm">
        <div onClick={() => setShowCollectionMenu(!showCollectionMenu)}>
          <InputText
            name="collection"
            leftComponent={<SearchIcon className="h-5 w-5 text-gray-400" />}
            placeholder="Search for collection"
            onChange={() => {}}
          />
        </div>
        {showCollectionMenu && (
          <OutsideClickHandler onOutsideClick={() => setShowCollectionMenu(false)}>
            <CollectionMenu
              defaultCollection={defaultCollection}
              collection={collection}
              onChange={onCollectionChange}
            />
          </OutsideClickHandler>
        )}

        <div className="mt-4 ">
          <ul className="space-y-2">
            {collection.map((item, index) => {
              return (
                <li className="flex flex-row justify-between " key={index}>
                  <Button theme="clear" buttonStyle="text-sm text-blue-500 underline">
                    {item.name}
                  </Button>

                  <Button theme="clear" onClick={() => onCollectionChange(item, false)}>
                    X
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>

        {!collection.length && (
          <div className="block text-sm text-gray-500">
            Add this product to a collection so it’s easy to find in your store.
          </div>
        )}
      </div>

      <Border />

      <Subheader text={'TAGS'} headerStyle={'text-xs'} />

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
        isLoading={isTagsLoading}
        noOptionsMessage={() => null}
        options={defaultTags.map(({id, name}) => ({
          value: id,
          label: name,
        }))}
        value={tags.map(({id, name}) => ({
          value: id,
          label: name,
        }))}
        onCreateOption={value => onTagsCreate(value)}
      />
    </Card>
  );
}
