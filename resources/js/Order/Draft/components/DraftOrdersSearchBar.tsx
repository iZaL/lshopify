import {Popover, Transition} from '@headlessui/react';
import {SearchIcon} from '@heroicons/react/outline';
import {ChevronDownIcon, SortAscendingIcon} from '@heroicons/react/solid';
import classNames from 'classnames';
import React, {Fragment} from 'react';

interface TabProps {
  name: string;
  href: string;
  current: boolean;
}

interface Props {
  tabs: TabProps[];
  onMoreFiltersClick: () => void;
}

export default function DraftOrdersSearchBar({
  tabs,
  onMoreFiltersClick,
}: Props) {
  return (
    <div className="">
      <div className="p-4 md:hidden">
        <select
          id="selected-tab"
          name="selected-tab"
          className="mt-1 block w-full rounded-md border-2 border-gray-300 py-2 text-base focus:border-none focus:outline-none focus:ring-0 sm:text-sm"
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
                  'mx-2 whitespace-nowrap border-b-2 py-3 px-6 text-sm font-medium',
                )}>
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="my-5 divide-y divide-gray-200 px-4">
        <div className="mt-6 grid grid-cols-12 gap-6">
          <div className="col-span-12 sm:col-span-6">
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:blue-500 block w-full rounded-md border border-gray-300 py-2 px-10 shadow-sm focus:border-blue-500 focus:outline-none sm:text-sm"
                placeholder="Filter collections"
              />
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6">
            <div className="relative z-20 inline-flex rounded-md shadow-sm sm:space-x-3 sm:shadow-none">
              <Popover.Group className="flex items-center">
                <div className="inline-flex sm:shadow-sm">
                  <Popover className="relative inline-block text-left">
                    <Popover.Button
                      className="group hidden justify-center rounded-l-md border border-gray-300 px-4
                       py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900 sm:inline-flex
                      ">
                      <span>Availability</span>
                      <ChevronDownIcon
                        className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
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
                      <Popover.Panel className="absolute right-0 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <form className="space-y-4">
                          <div className="flex items-center">
                            <input
                              id="filter-1-1"
                              name="1[]"
                              defaultValue={1}
                              type="checkbox"
                              defaultChecked={false}
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor="filter-1-1"
                              className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900">
                              zalsstoredev
                            </label>
                          </div>
                        </form>
                      </Popover.Panel>
                    </Transition>
                  </Popover>

                  <button
                    type="button"
                    onClick={onMoreFiltersClick}
                    className="relative -ml-px items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 sm:inline-flex md:rounded-r-md">
                    <span>Type</span>
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

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95">
                      <Popover.Panel className="absolute right-0 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <form className="space-y-4">
                          <div className="flex items-center">
                            <input
                              id="filter-1-1"
                              name="1[]"
                              type="radio"
                              defaultChecked={false}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor="filter-1-1"
                              className="ml-3 whitespace-nowrap pr-6 text-sm text-gray-900">
                              Product title A-Z
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              id="filter-1-1"
                              name="1[]"
                              type="radio"
                              defaultChecked={false}
                              className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label
                              htmlFor="filter-1-1"
                              className="ml-3 whitespace-nowrap pr-6 text-sm text-gray-900">
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
