import {Popover, Transition} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/solid';
import React, {Fragment, useState} from 'react';

import TabPill from '../../components/TabPill';

type Field = string;

interface Props {
  collection: any;
  onChange: (attributes: any) => void;
}

export default function BulkEditor(props: Props) {
  console.log('props', props);

  const defaultAttributes = ['sku', 'price', 'compare_at_price'];

  const [selectedFields, setSelectedFields] =
    useState<Field[]>(defaultAttributes);

  return (
    <>
      {selectedFields.map((field, idx) => (
        <TabPill key={idx} title={field} onClose={() => {}} />
      ))}
      <div className="col-span-12 sm:col-span-6">
        <div className="relative z-0 inline-flex rounded-md shadow-sm sm:space-x-3 sm:shadow-none">
          <Popover.Group className="flex items-center">
            <div className="inline-flex sm:shadow-sm">
              <Popover className="relative inline-block text-left">
                <Popover.Button
                  className="group hidden justify-center rounded-md border border-gray-300 px-4
                       text-gray-900 hover:bg-gray-50 hover:text-gray-900 sm:inline-flex
                      ">
                  <span>Vendor</span>
                  <ChevronDownIcon
                    className="-mr-1 ml-1 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
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
                  <Popover.Panel className="absolute right-0 mt-2 origin-top-right rounded-md bg-white p-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p flex min-w-[350px] flex-row items-center">
                      <div className="w-1/3">General</div>
                      <div className="inline-flex w-2/3 flex-wrap items-center">
                        <div className="mb-2 ml-2 rounded border px-2">
                          Title
                        </div>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </Popover>
            </div>
          </Popover.Group>
        </div>
      </div>
    </>
  );
}
