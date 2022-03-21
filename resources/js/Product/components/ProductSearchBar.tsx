import React, {useState} from 'react';
import {SearchIcon} from '@heroicons/react/outline';
import {SortAscendingIcon, XIcon} from '@heroicons/react/solid';
import classNames from 'classnames';
import {Popover} from '@headlessui/react';
import InputText from '../../components/forms/InputText';
import {Category, Collection, Vendor} from '../../types';
import Button from '../../components/Button';
import Checkbox from '../../components/forms/Checkbox';
import {SearchAttributes, TabAttributes} from '../types';
import RightSidebar from '../../components/RightSidebar';
import PopoverButton from '../../components/PopoverButton';
import DisclosurePanel from '../../components/DisclosurePanel';

interface Props {
  tabs: TabAttributes[];
  searchAttributes: SearchAttributes;
  onChange: (data: SearchAttributes) => void;
  vendors: Vendor[];
  categories: Category[];
  collections: Collection[];
}

export default function ProductSearchBar({
  tabs,
  onChange,
  vendors,
  searchAttributes,
  categories,
  collections,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onMoreFiltersClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const setSearchAttributes = <T extends keyof SearchAttributes>(
    key: T,
    value: SearchAttributes[T],
  ) => {
    onChange({
      ...searchAttributes,
      [key]: value,
    });
  };

  const setVendor = (vendorID: Vendor['id']) => {
    const includes = searchAttributes.selected_vendors.includes(vendorID);
    if (includes) {
      setSearchAttributes(
        'selected_vendors',
        searchAttributes.selected_vendors.filter(v => v !== vendorID),
      );
    } else {
      setSearchAttributes('selected_vendors', [
        ...searchAttributes.selected_vendors,
        vendorID,
      ]);
    }
  };

  const setCollection = (collectionID: Collection['id']) => {
    const includes =
      searchAttributes.selected_collections.includes(collectionID);
    if (includes) {
      setSearchAttributes(
        'selected_collections',
        searchAttributes.selected_collections.filter(v => v !== collectionID),
      );
    } else {
      setSearchAttributes('selected_collections', [
        ...searchAttributes.selected_collections,
        collectionID,
      ]);
    }
  };

  const setStatus = (tab: TabAttributes) => {
    const includes = searchAttributes.selected_status.includes(tab);
    if (includes) {
      setSearchAttributes(
        'selected_status',
        searchAttributes.selected_status.filter(v => v !== tab),
      );
    } else {
      setSearchAttributes('selected_status', [
        ...searchAttributes.selected_status,
        tab,
      ]);
    }
  };

  const setCategory = (categoryID: Category['id']) => {
    const includes = searchAttributes.selected_categories.includes(categoryID);
    if (includes) {
      setSearchAttributes(
        'selected_categories',
        searchAttributes.selected_status.filter(v => v !== categoryID),
      );
    } else {
      setSearchAttributes('selected_categories', [
        ...searchAttributes.selected_categories,
        categoryID,
      ]);
    }
  };

  const ClearButton = <T extends keyof SearchAttributes>({
    field,
    value,
    disabled = false,
  }: {
    field: T;
    value: SearchAttributes[T];
    disabled?: boolean;
  }) => {
    return (
      <Button
        theme={'clear'}
        onClick={() => setSearchAttributes(field, value)}
        buttonStyle={'text-gray-400'}
        disabled={disabled}>
        Clear
      </Button>
    );
  };

  return (
    <div className="">
      <RightSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={'More Filters'}>
        <div className="absolute inset-0 px-4 text-sm sm:px-6">
          <div className="space-y-4">
            <DisclosurePanel title="Product Vendor">
              <div className="flex flex-col space-y-1">
                {vendors.map(vendor => {
                  return (
                    <Checkbox
                      key={vendor.id}
                      checked={searchAttributes.selected_vendors.includes(
                        vendor.id,
                      )}
                      name={`vendor${vendor.id}`}
                      onChange={() => setVendor(vendor.id)}
                      label={vendor.name}
                    />
                  );
                })}
              </div>
              <ClearButton
                field={'selected_vendors'}
                value={[]}
                disabled={!searchAttributes.selected_vendors.length}
              />
            </DisclosurePanel>

            <DisclosurePanel title="Product Status">
              <div className="flex flex-col space-y-1">
                {tabs
                  .filter(tab => tab !== 'all')
                  .map(tab => {
                    return (
                      <Checkbox
                        key={tab}
                        checked={searchAttributes.selected_status.includes(tab)}
                        name={`tab${tab}`}
                        onChange={() => setStatus(tab)}
                        label={tab}
                      />
                    );
                  })}
              </div>
              <ClearButton
                field={'selected_status'}
                value={[]}
                disabled={!searchAttributes.selected_status.length}
              />
            </DisclosurePanel>

            <DisclosurePanel title="Tagged with">
              <InputText
                name="tag"
                value={searchAttributes.tag_term}
                onChange={event =>
                  setSearchAttributes('tag_term', event.target.value)
                }
                inputStyle="w-36"
              />
              <ClearButton
                field={'tag_term'}
                value={''}
                disabled={!searchAttributes.tag_term}
              />
            </DisclosurePanel>

            <DisclosurePanel title="Product Type">
              <div className="flex flex-col space-y-1">
                {categories.map(category => {
                  return (
                    <Checkbox
                      key={category.id}
                      checked={searchAttributes.selected_categories.includes(
                        category.id,
                      )}
                      name={`category${category.id}`}
                      onChange={() => setCategory(category.id)}
                      label={category.name}
                    />
                  );
                })}
              </div>
              <ClearButton
                field={'selected_categories'}
                value={[]}
                disabled={!searchAttributes.selected_categories.length}
              />
            </DisclosurePanel>

            <DisclosurePanel title="Collections">
              <div className="relative rounded-md shadow-sm">
                <InputText
                  name="collection_term"
                  value={searchAttributes.search_term}
                  onChange={event =>
                    setSearchAttributes('collection_term', event.target.value)
                  }
                  placeholder="Search for collections"
                  leftComponent={
                    <SearchIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  }
                />
              </div>

              <div className="flex flex-col space-y-1">
                {collections.map(collection => {
                  return (
                    <Checkbox
                      key={collection.id}
                      checked={searchAttributes.selected_collections.includes(
                        collection.id,
                      )}
                      name={`collection${collection.id}`}
                      onChange={() => setCollection(collection.id)}
                      label={collection.name}
                    />
                  );
                })}
              </div>
              <ClearButton
                field={'selected_collections'}
                value={[]}
                disabled={!searchAttributes.selected_collections.length}
              />
            </DisclosurePanel>
          </div>
        </div>
      </RightSidebar>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-2">
          {tabs.map(tab => {
            return (
              <Button
                theme="clear"
                key={tab}
                buttonStyle={classNames(
                  tab === searchAttributes.selected_view
                    ? 'border-green-800 text-green-800'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'mx-2 whitespace-nowrap border-b-2 py-3 px-6 text-sm font-medium',
                )}
                onClick={() => {
                  onChange({
                    tag_term: '',
                    search_term: '',
                    collection_term: '',
                    selected_view: tab,
                    selected_vendors: [],
                    selected_status: [],
                    selected_categories: [],
                    selected_collections: [],
                  });
                }}>
                <span className="capitalize">{tab}</span>
              </Button>
            );
          })}
        </nav>
      </div>

      <div className="my-5 px-4">
        <div className="mt-6 grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-6">
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <InputText
                name="search_term"
                value={searchAttributes.search_term}
                onChange={event =>
                  setSearchAttributes('search_term', event.target.value)
                }
                placeholder="Search products"
              />
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <div className="relative z-10 inline-flex rounded-md shadow-sm sm:space-x-3 sm:shadow-none">
              <Popover.Group className="flex items-center">
                <div className="inline-flex sm:shadow-sm">
                  <PopoverButton title={'Vendor'} buttonStyle={'rounded-l-md '}>
                    {vendors.map(vendor => {
                      return (
                        <Checkbox
                          key={vendor.id}
                          checked={searchAttributes.selected_vendors.includes(
                            vendor.id,
                          )}
                          name={`vendor${vendor.id}`}
                          onChange={() => setVendor(vendor.id)}
                          label={vendor.name}
                        />
                      );
                    })}
                  </PopoverButton>

                  <PopoverButton title="Tagged" buttonStyle="-ml-px">
                    <div className="flex items-center">
                      <InputText
                        name="tag"
                        value={searchAttributes.tag_term}
                        onChange={event =>
                          setSearchAttributes('tag_term', event.target.value)
                        }
                        inputStyle="w-36"
                      />
                    </div>
                  </PopoverButton>

                  <PopoverButton title={'Status'} buttonStyle="-ml-px">
                    {tabs
                      .filter(tab => tab !== 'all')
                      .map(tab => {
                        return (
                          <Checkbox
                            key={tab}
                            checked={searchAttributes.selected_status.includes(
                              tab,
                            )}
                            name={`tab${tab}`}
                            onChange={() => setStatus(tab)}
                            label={tab}
                          />
                        );
                      })}
                  </PopoverButton>

                  <button
                    type="button"
                    onClick={onMoreFiltersClick}
                    className="relative -ml-px items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 sm:inline-flex md:rounded-r-md">
                    <span>Filters</span>
                  </button>
                </div>

                <div className="ml-4 hidden space-x-3 lg:flex">
                  <Popover className="relative inline-block text-left">
                    <Popover.Button className="relative -ml-px items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 sm:inline-flex">
                      <SortAscendingIcon
                        className="mr-2.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span>Sort</span>
                    </Popover.Button>

                    <Popover.Panel className="absolute right-0 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="flex items-center">
                        <input
                          id={`filter-1-1`}
                          name={`1[]`}
                          type="radio"
                          defaultChecked={false}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`filter-1-1`}
                          className="ml-3 whitespace-nowrap pr-6 text-sm text-gray-900">
                          Product title A-Z
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id={`filter-1-1`}
                          name={`1[]`}
                          type="radio"
                          defaultChecked={false}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`filter-1-1`}
                          className="ml-3 whitespace-nowrap pr-6 text-sm text-gray-900">
                          Product title Z-A
                        </label>
                      </div>
                    </Popover.Panel>
                  </Popover>
                </div>
              </Popover.Group>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center space-x-2 pt-2 text-sm text-gray-800">
          {searchAttributes.selected_vendors.length ? (
            <div className="inline-flex space-x-1 rounded-md bg-gray-200 py-1 pl-2">
              <span>Product vendor is</span>
              <span>
                {searchAttributes.selected_vendors
                  .map(vendorID => vendors.find(({id}) => id === vendorID))
                  .map(vendor => (vendor ? vendor.name : null))
                  .join(', ')}
              </span>

              <Button
                theme="clear"
                onClick={() => setSearchAttributes('selected_vendors', [])}
                buttonStyle="hover:bg-gray-100">
                <XIcon className="h-4 text-gray-500" />
              </Button>
            </div>
          ) : null}

          {searchAttributes.selected_status.length ? (
            <div className="inline-flex space-x-1 rounded-md bg-gray-200 py-1 pl-2 ">
              <span>Product status is </span>
              <span>
                {searchAttributes.selected_status
                  .map(status => (status === 'active' ? 'Active' : 'Inactive'))
                  .join(', ')}
              </span>
              <Button
                theme="clear"
                onClick={() => setSearchAttributes('selected_status', [])}
                buttonStyle="hover:bg-gray-100">
                <XIcon className="h-4 text-gray-500" />
              </Button>
            </div>
          ) : null}

          {searchAttributes.tag_term ? (
            <div className="inline-flex space-x-1 rounded-md bg-gray-200 py-1 pl-2 ">
              <span>Tagged with </span>
              <span>{searchAttributes.tag_term}</span>
              <Button
                theme="clear"
                onClick={() => setSearchAttributes('tag_term', '')}
                buttonStyle="hover:bg-gray-100">
                <XIcon className="h-4 text-gray-500" />
              </Button>
            </div>
          ) : null}

          {searchAttributes.selected_categories.length ? (
            <div className="inline-flex space-x-1 rounded-md bg-gray-200 py-1 pl-2">
              <span>Product type is</span>
              <span>
                {searchAttributes.selected_categories
                  .map(categoryID =>
                    categories.find(({id}) => id === categoryID),
                  )
                  .map(category => (category ? category.name : null))
                  .join(', ')}
              </span>

              <Button
                theme="clear"
                onClick={() => setSearchAttributes('selected_categories', [])}
                buttonStyle="hover:bg-gray-100">
                <XIcon className="h-4 text-gray-500" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
