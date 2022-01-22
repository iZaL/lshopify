import React from 'react';
import {Disclosure} from '@headlessui/react';
import {ChevronDownIcon, ChevronUpIcon} from '@heroicons/react/solid';

const DisclosureButton = ({open, title}: {open: boolean; title: string}) => {
  return (
    <h3 className="-mx-2 -my-3 flow-root">
      <Disclosure.Button
        className={`px-2 py-2 rounded-sm bg-white w-full flex items-center justify-between text-gray-400 ${
          !open && 'focus:ring-2 focus:ring-blue-500'
        } hover:bg-gray-100 border-radius-2 hover:text-gray-500`}>
        <span className="font-medium text-gray-900">{title}</span>
        <span className="ml-6 flex items-center">
          {open ? (
            <ChevronUpIcon
              className="h-6 w-6 text-black-50"
              aria-hidden="true"
            />
          ) : (
            <ChevronDownIcon
              className="h-6 w-6 text-black-50"
              aria-hidden="true"
            />
          )}
        </span>
      </Disclosure.Button>
    </h3>
  );
};

export default function ProductFiltersPanel() {
  return (
    <div className="absolute inset-0 px-4 sm:px-6 text-sm">
      <div className="space-y-6">
        <Disclosure as="div" className="">
          {({open}) => (
            <>
              <DisclosureButton open={open} title={'Product Vendor'} />
              <Disclosure.Panel className="pt-4" static={open}>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id={`filter-mobile-1-1`}
                      name={`1[]`}
                      defaultValue={1}
                      type="checkbox"
                      defaultChecked={true}
                      className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`filter-mobile-1-1`}
                      className="ml-3 min-w-0 flex-1 text-gray-500">
                      zalsvendor
                    </label>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <Disclosure as="div" className="">
          {({open}) => (
            <>
              <DisclosureButton open={open} title={'Tagged with'} />
              <Disclosure.Panel className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id={`filter-mobile-1-1`}
                      name={`1[]`}
                      defaultValue={1}
                      type="checkbox"
                      defaultChecked={true}
                      className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`filter-mobile-1-1`}
                      className="ml-3 min-w-0 flex-1 text-gray-500">
                      zalsvendor
                    </label>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <Disclosure as="div" className="">
          {({open}) => (
            <>
              <DisclosureButton open={open} title={'Status'} />
              <Disclosure.Panel className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id={`filter-mobile-1-1`}
                      name={`1[]`}
                      defaultValue={1}
                      type="checkbox"
                      defaultChecked={true}
                      className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`filter-mobile-1-1`}
                      className="ml-3 min-w-0 flex-1 text-gray-500">
                      zalsvendor
                    </label>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
