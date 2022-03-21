import React from 'react';
import {SearchIcon} from '@heroicons/react/outline';
import {
  ChevronDownIcon,
  SortAscendingIcon,
  XIcon,
} from '@heroicons/react/solid';
import classNames from 'classnames';
import {Popover} from '@headlessui/react';
import InputText from '../../components/forms/InputText';
import {Vendor} from '../../types';
import Button from '../../components/Button';
import Checkbox from '../../components/forms/Checkbox';
import {SearchAttributes, TabAttributes} from '../types';
import TabPill from '../../components/TabPill';

interface Props {
  tabs: TabAttributes[];
  searchAttributes: SearchAttributes;
  onChange: (data: SearchAttributes) => void;
  onMoreFiltersClick: () => void;
  vendors: Vendor[];
}

export default function ProductSearchBar({
  onMoreFiltersClick,
  tabs,
  onChange,
  vendors,
  searchAttributes,
}: Props) {
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

  return (
    <div className="">
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
                    selected_vendors: [],
                    selected_view: tab,
                    selected_status: [],
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
                  <Popover className="relative inline-block text-left">
                    <Popover.Button
                      className="group hidden justify-center rounded-l-md border border-gray-300 px-4
                       py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900 sm:inline-flex
                      ">
                      <span>Vendor</span>
                      <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Popover.Panel className="absolute right-0 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                    </Popover.Panel>
                  </Popover>
                  <Popover className="relative inline-block text-left">
                    <Popover.Button className="relative -ml-px hidden items-center border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:inline-flex">
                      <span>Tagged</span>
                      <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Popover.Panel className="absolute right-0 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                    </Popover.Panel>
                  </Popover>

                  <Popover className="relative inline-block text-left">
                    <Popover.Button className="relative -ml-px hidden items-center border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:inline-flex">
                      <span>Status</span>
                      <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Popover.Panel className="absolute right-0 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                    </Popover.Panel>
                  </Popover>

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
            <div className="inline-flex space-x-1 rounded-md bg-gray-200 py-1 pl-2 ">
              <span>Product vendor is </span>
              {searchAttributes.selected_vendors
                .map(vendorID => vendors.find(({id}) => vendorID))
                .map(vendor => {
                  if (!vendor) return null;
                  return <span>{vendor.name}</span>;
                })}
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
              {searchAttributes.selected_status.map(status => (
                <span>{status}</span>
              ))}
              <Button
                theme="clear"
                onClick={() => setSearchAttributes('selected_status', [])}
                buttonStyle="hover:bg-gray-100">
                <XIcon className="h-4 text-gray-500" />
              </Button>
            </div>
          ) : null}
        </div>

        {/*<div className="inline-flex bg-gray-200 rounded-md pl-2 py-1 ">*/}
        {/*  {searchAttributes.selected_status.length ? (*/}
        {/*    <div className='flex flex-row bg-gray-200 items-center space-x-2 px-2 py-1 '>*/}
        {/*      <div className=''>Product status is</div>*/}
        {/*      {searchAttributes.selected_status*/}
        {/*        .map(status => {*/}
        {/*          return (*/}
        {/*            <div>{status}</div>*/}
        {/*          );*/}
        {/*        })}*/}
        {/*    </div>*/}
        {/*  ) : null}*/}
        {/*  <Button*/}
        {/*    theme='clear'*/}
        {/*    onClick={() => setSearchAttributes('selected_status',[]) }*/}
        {/*    buttonStyle="hover:bg-gray-100"*/}
        {/*  >*/}
        {/*    <XIcon className='text-gray-500 h-4'  />*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
