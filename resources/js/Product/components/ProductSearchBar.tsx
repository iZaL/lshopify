import React, {Fragment} from 'react';
import {SearchIcon} from '@heroicons/react/outline';
import {ChevronDownIcon, SortAscendingIcon} from '@heroicons/react/solid';
import classNames from 'classnames';
import {Popover, Transition} from '@headlessui/react';
import InputText from '../../components/forms/InputText';

interface TabProps {
  name: string;
  href: string;
  current: boolean;
}

interface Props {
  tabs: TabProps[];
  onMoreFiltersClick: () => void;
}
// const filters = [
//   {
//     id: 'category',
//     name: 'Category',
//     options: [
//       { value: 'new-arrivals', label: 'All New Arrivals', checked: false },
//       { value: 'tees', label: 'Tees', checked: false },
//       { value: 'objects', label: 'Objects', checked: true },
//     ],
//   }
// ]

export default function ProductSearchBar({tabs, onMoreFiltersClick}: Props) {
  return (
    <div className="">
      <div className="md:hidden p-4">
        <select
          id="selected-tab"
          name="selected-tab"
          className="mt-1 block w-full text-base border-gray-300 border-2 py-2 focus:outline-none focus:ring-0 focus:border-none sm:text-sm rounded-md"
          defaultValue={tabs.find(tab => tab?.current)?.name}>
          {tabs.map(tab => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>

      <div className="hidden md:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-2">
            {tabs.map(tab => (
              <a
                key={tab.name}
                href={tab.href}
                className={classNames(
                  tab.current
                    ? 'border-green-800 text-green-800'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap mx-2 py-3 px-6 border-b-2 font-medium text-sm',
                )}>
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="px-4 my-5 divide-y divide-gray-200">
        <div className="mt-6 grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-6">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-10 focus:outline-none focus:blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Filter Products"
              />
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <div className="relative z-0 inline-flex shadow-sm rounded-md sm:shadow-none sm:space-x-3">
              <Popover.Group className="flex items-center">
                <div className="inline-flex sm:shadow-sm">
                  <Popover className="relative inline-block text-left">
                    <Popover.Button
                      className="hidden group sm:inline-flex justify-center text-sm font-medium hover:text-gray-900
                       px-4 py-2 rounded-l-md border border-gray-300 text-gray-900 hover:bg-gray-50
                      ">
                      <span>Vendor</span>
                      <ChevronDownIcon
                        className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95">
                      <Popover.Panel className="origin-top-right absolute right-0 mt-2 bg-white rounded-md shadow-2xl p-4 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <form className="space-y-4">
                          <div className="flex items-center">
                            <input
                              id={`filter-1-1`}
                              name={`1[]`}
                              defaultValue={1}
                              type="checkbox"
                              defaultChecked={false}
                              className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`filter-1-1`}
                              className="ml-3 pr-6 text-sm font-medium text-gray-900 whitespace-nowrap">
                              zalsstoredev
                            </label>
                          </div>
                        </form>
                      </Popover.Panel>
                    </Transition>
                  </Popover>
                  <Popover className="relative inline-block text-left">
                    <Popover.Button className="hidden sm:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-900 hover:bg-gray-50">
                      <span>Tagged</span>
                      <ChevronDownIcon
                        className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95">
                      <Popover.Panel className="origin-top-right absolute right-0 mt-2 bg-white rounded-md shadow-2xl p-4 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <form className="space-y-4">
                          <div className="flex items-center">
                            <InputText
                              name="tag"
                              onChange={() => {}}
                              inputStyle="w-36"
                            />
                          </div>
                        </form>
                      </Popover.Panel>
                    </Transition>
                  </Popover>

                  <Popover className="relative inline-block text-left">
                    <Popover.Button className="hidden sm:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 text-sm font-medium text-gray-900 hover:bg-gray-50">
                      <span>Status</span>
                      <ChevronDownIcon
                        className="flex-shrink-0 -mr-1 ml-1 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95">
                      <Popover.Panel className="origin-top-right absolute right-0 mt-2 bg-white rounded-md shadow-2xl p-4 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <form className="space-y-4">
                          <div className="flex items-center">
                            <input
                              id={`filter-1-1`}
                              name={`1[]`}
                              defaultValue={1}
                              type="checkbox"
                              defaultChecked={false}
                              className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`filter-1-1`}
                              className="ml-3 pr-6 text-sm font-medium text-gray-900 whitespace-nowrap">
                              Active
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id={`filter-1-1`}
                              name={`1[]`}
                              defaultValue={1}
                              type="checkbox"
                              defaultChecked={false}
                              className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor={`filter-1-1`}
                              className="ml-3 pr-6 text-sm font-medium text-gray-900 whitespace-nowrap">
                              Draft
                            </label>
                          </div>
                        </form>
                      </Popover.Panel>
                    </Transition>
                  </Popover>

                  <button
                    type="button"
                    onClick={onMoreFiltersClick}
                    className="sm:inline-flex -ml-px relative items-center px-4 py-2 md:rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600">
                    <span>Filters</span>
                  </button>
                </div>

                <div className="hidden lg:flex space-x-3 ml-4">
                  <Popover className="relative inline-block text-left">
                    <Popover.Button className="sm:inline-flex -ml-px relative items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600">
                      <SortAscendingIcon
                        className="mr-2.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span>Sort</span>
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95">
                      <Popover.Panel className="origin-top-right absolute right-0 mt-2 bg-white rounded-md shadow-2xl p-4 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <form className="space-y-4">
                          <div className="flex items-center">
                            <input
                              id={`filter-1-1`}
                              name={`1[]`}
                              type="radio"
                              defaultChecked={false}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                            />
                            <label
                              htmlFor={`filter-1-1`}
                              className="ml-3 pr-6 text-sm text-gray-900 whitespace-nowrap">
                              Product title A-Z
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id={`filter-1-1`}
                              name={`1[]`}
                              type="radio"
                              defaultChecked={false}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                            />
                            <label
                              htmlFor={`filter-1-1`}
                              className="ml-3 pr-6 text-sm text-gray-900 whitespace-nowrap">
                              Product title Z-A
                            </label>
                          </div>
                        </form>
                      </Popover.Panel>
                    </Transition>
                  </Popover>
                </div>
              </Popover.Group>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
