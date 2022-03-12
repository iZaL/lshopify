import React, {Fragment, useState} from 'react';
import {Popover, Transition} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/solid';
import TagClose from '../../components/TagClose';

type Field = string;
// interface Field {
//   name:string;
//   label:string;
// }

interface Props {
  collection: any;
  // attributes:any;
  // defaultAttributes:any;
  onChange: (attributes: any) => void;
  // collection:Product[]|Order[];
  // fields:Field[];
}

export default function BulkEditor(props: Props) {
  console.log('props', props);

  const defaultAttributes = ['sku', 'price', 'compare_at_price'];
  const attributes = {
    title: 'Title',
    description: 'Description',
    price: 'Price',
    cost_price: 'Cost Price',
    compare_at_price: 'Compare At Price',
    weight: 'Weight',
    sku: 'SKU',
    out_of_stock_sale: 'Inventory Policy',
    requires_shipping: 'Shipping',
    quantity: 'Quantity',
  };

  const generalAttributes = [attributes.title];

  // return null;
  // console.log('props',props);
  // const { collection, fields } = props;
  //
  const [selectedFields, setSelectedFields] =
    useState<Field[]>(defaultAttributes);

  return (
    <>
      {selectedFields.map((field, idx) => {
        return <TagClose key={idx} title={field} onClick={() => {}} />;
      })}
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
                    <div className="flex flex-row items-center p min-w-[350px]">
                      <div className="w-1/3">General</div>
                      <div className="w-2/3 inline-flex items-center flex-wrap">
                        <div className="px-2 border rounded mb-2 ml-2">
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
