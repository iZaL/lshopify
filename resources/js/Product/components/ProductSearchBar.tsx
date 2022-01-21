import React from 'react';
import {
  PencilIcon,
  ReplyIcon,
  SearchIcon,
  UserAddIcon,
} from '@heroicons/react/outline';
import {
  ArchiveIcon,
  ArrowDownIcon,
  ChevronDoubleDownIcon,
  ChevronDownIcon,
  SortAscendingIcon,
} from '@heroicons/react/solid';
import classNames from 'classnames';

interface TabProps {
  name: string;
  href: string;
  current: boolean;
}

interface Props {
  tabs: TabProps[];
  onMoreFiltersClick: () => void;
}

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
              <div className="inline-flex sm:shadow-sm">
                <button
                  type="button"
                  className="hidden sm:inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600">
                  <span>Vendor</span>
                  <ChevronDownIcon
                    className="ml-2.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  className="hidden sm:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600">
                  <span>Tagged</span>
                  <ChevronDownIcon
                    className="ml-2.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  className="hidden sm:inline-flex -ml-px relative items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600">
                  <span>Status</span>
                  <ChevronDownIcon
                    className="ml-2.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </button>

                <button
                  type="button"
                  onClick={onMoreFiltersClick}
                  className="sm:inline-flex -ml-px relative items-center px-4 py-2 md:rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600">
                  <span>Filters</span>
                </button>
              </div>

              <div className="hidden lg:flex space-x-3">
                <button
                  type="button"
                  className="sm:inline-flex -ml-px relative items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600">
                  <SortAscendingIcon
                    className="mr-2.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Sort</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
