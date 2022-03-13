import React, {Fragment} from 'react';
import {Popover, Transition} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/solid';
import Button from '../../../components/Button';
import {AttributeLabel, ProductAttributes, VariantAttributes} from './types';

export default function TagsPopup({
  buttons,
  onButtonClick,
  selectedAttributes,
  attributeLabels,
}: {
  buttons: {[p: string]: Array<ProductAttributes | VariantAttributes>};
  onButtonClick: (button: ProductAttributes | VariantAttributes) => void;
  selectedAttributes: (ProductAttributes | VariantAttributes)[];
  attributeLabels: AttributeLabel;
}) {
  return (
    <div className="col-span-12 mt-2 ml-2 sm:col-span-6">
      <div className="relative z-30 inline-flex rounded-md shadow-sm sm:space-x-3 sm:shadow-none">
        <Popover.Group className="flex items-center">
          <div className="inline-flex sm:shadow-sm">
            <Popover className="relative inline-block text-left">
              <Popover.Button
                className="group inline-flex justify-center rounded-md border border-gray-300
                       px-4 text-gray-900 hover:bg-gray-50 hover:text-gray-900
                      ">
                <span>Add fields</span>
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
                <Popover.Panel className="absolute left-0 mt-2 max-h-[20rem] w-[36rem] origin-top-right divide-y overflow-y-scroll rounded-md bg-white p-2 text-sm shadow shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none ">
                  {Object.keys(buttons).map((key, idx) => {
                    return (
                      <dl key={idx} className="divide-y divide-black">
                        <div className="items-center py-2 sm:grid sm:grid-cols-4">
                          <dt>{key}</dt>
                          <dd className="mt-1 space-x-1 space-y-2 text-gray-900 sm:col-span-3 sm:mt-0">
                            {buttons[key].map((button, idx) => {
                              return (
                                <Button
                                  key={idx}
                                  theme="default"
                                  buttonStyle={`px-2 py-1 `}
                                  disabled={selectedAttributes.includes(button)}
                                  onClick={() => {
                                    onButtonClick(button);
                                  }}>
                                  {attributeLabels[button]}
                                </Button>
                              );
                            })}
                          </dd>
                        </div>
                      </dl>
                    );
                  })}
                </Popover.Panel>
              </Transition>
            </Popover>
          </div>
        </Popover.Group>
      </div>
    </div>
  );
}
