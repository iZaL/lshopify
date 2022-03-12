import React, {Fragment, ReactNode, useState} from 'react';
import Main from '../Main';
import FormSubmitBar from '../components/FormSubmitBar';
import {useForm} from '@inertiajs/inertia-react';
import {ButtonTheme, Product, Variant} from '../types';
import Card from '../components/Card';
import Subheader from '../components/Subheader';
import TagClose from '../components/TagClose';
import BulkEditor from './components/BulkEditor';
import {Popover, Transition} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/solid';
import * as stream from 'stream';
import Button from '../components/Button';
import Border from '../components/Border';

interface Props {
  products: Product[];
}

interface ButtonProps {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  buttonStyle?: string;
}

type Form = {
  products: Product[];
};

type Attributes = {
  [name in keyof Variant | keyof Product]: string;
};

export default function ProductBulkEdit(props: Props) {
  const {products} = props;

  const formProps: Form = {
    products: products,
  };

  const onChange = (attributes: any) => {
    console.log('attributes', attributes);
  };

  const {data, setData, post, isDirty} = useForm<Form>(formProps);

  const handleSubmit = (): void => {};

  const defaultProductAttributes: Array<keyof Product> = ['title', 'status'];
  const defaultVariantAttributes: Array<keyof Variant> = ['sku', 'price'];

  const attributeLabels: Partial<Attributes> = {
    title: 'Title',
    status: 'Status',
    price: 'Price',
    compare_at_price: 'Compare At Price',
    cost_price: 'Cost Price',
    sku: 'SKU',
    barcode: 'Barcode',
    weight: 'Weight',
    quantity: 'Quantity',
    requires_shipping: 'Requires Shipping',
    taxable: 'Taxable',
    hs_code: 'HS Code',
    track_quantity: 'Track Quantity',
    out_of_stock_sale: 'Out of Stock Sale',
    origin_country_id: 'Origin Country',
  };

  const allVariantAttributes: Array<keyof Variant> = [
    'price',
    'compare_at_price',
    'cost_price',
    'taxable',
    'sku',
    'barcode',
    'weight',
    'quantity',
    'hs_code',
    'out_of_stock_sale',
    'track_quantity',
    'requires_shipping',
    'weight',
    'origin_country_id',
  ];

  const AttributeButton = (props: ButtonProps) => {
    return (
      <Button
        {...props}
        theme="default"
        buttonStyle={`${props.buttonStyle} my-1 py-1 `}
      >
        {props.title}
      </Button>
    );
  };

  const [productAttributes, setProductAttributes] = useState<
    Array<keyof Product>
  >(defaultProductAttributes);
  const [variantAttributes, setVariantAttributes] = useState<
    Array<keyof Variant>
  >(defaultVariantAttributes);

  return (
    <Main>
      <div className="p-6">
        <FormSubmitBar onSubmit={handleSubmit} show={isDirty} />
        <Card>
          <div className="text-gray-700 text-sm">
            Currently editing these fields:
          </div>
          <div className="inline-flex space-x-2">
            <>
              {productAttributes.map((attribute, idx) => (
                <TagClose
                  key={idx}
                  title={attributeLabels[attribute] ?? '-'}
                  onClick={() => {}}
                />
              ))}
              <div className="col-span-12 sm:col-span-6">
                <div className="relative z-0 inline-flex rounded-md shadow-sm sm:space-x-3 sm:shadow-none">
                  <Popover.Group className="flex items-center">
                    <div className="inline-flex sm:shadow-sm">
                      <Popover className="relative inline-block text-left">
                        <Popover.Button
                          className="group justify-center rounded-md border border-gray-300 px-4
                       text-gray-900 hover:bg-gray-50 hover:text-gray-900 inline-flex
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
                          <Popover.Panel className="absolute left-0 mt-2 origin-top-right rounded-md bg-white p-2 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none w-[40rem] text-sm h-[20rem] overflow-y-scroll ">
                            <dl>
                              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
                                <dt>General</dt>
                                <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2 space-x-2 space-y-1">
                                  <AttributeButton
                                    title="Title"
                                    buttonStyle="ml-2"
                                  />
                                  <AttributeButton
                                    title="Tags"
                                    onClick={() => {}}
                                  />
                                  <AttributeButton
                                    title="Status"
                                    onClick={() => {}}
                                  />
                                </dd>
                              </div>
                            </dl>

                            <Border borderStyle="my-0" />

                            <dl>
                              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
                                <dt>Pricing</dt>
                                <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2 space-x-2 space-y-1">
                                  <AttributeButton
                                    title="Price"
                                    buttonStyle="ml-2"
                                    onClick={() => {}}
                                  />
                                  <AttributeButton
                                    title="Compare at price"
                                    onClick={() => {}}
                                  />
                                  <AttributeButton
                                    title="Cost per item"
                                    onClick={() => {}}
                                  />
                                  <AttributeButton
                                    title="Charge taxes"
                                    onClick={() => {}}
                                  />
                                </dd>
                              </div>
                            </dl>

                            <Border borderStyle="my-0" />

                            <dl>
                              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
                                <dt>Inventory</dt>
                                <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2 space-x-2 space-y-1">
                                  <AttributeButton
                                    title="SKU"
                                    buttonStyle="ml-2"
                                    onClick={() => {}}
                                  />
                                  <AttributeButton
                                    title="Barcode"
                                    onClick={() => {}}
                                  />
                                  <AttributeButton
                                    title="Inventory quantity"
                                    onClick={() => {}}
                                  />

                                  <AttributeButton
                                    title="Continue selling when out of stock"
                                    onClick={() => {}}
                                  />
                                  <AttributeButton
                                    title="Track quantity"
                                    onClick={() => {}}
                                  />
                                </dd>
                              </div>
                            </dl>

                            <Border borderStyle="my-0" />

                            <dl>
                              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
                                <dt>Shipping</dt>
                                <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2 space-x-2 space-y-1">
                                  <AttributeButton
                                    title="Weight"
                                    buttonStyle="ml-2"
                                    onClick={() => {}}
                                  />

                                  <AttributeButton
                                    title="Requires shipping"
                                    onClick={() => {}}
                                  />

                                  <AttributeButton
                                    title="HS Code"
                                    onClick={() => {}}
                                  />
                                  <AttributeButton
                                    title="Country of origin"
                                    onClick={() => {}}
                                  />
                                </dd>
                              </div>
                            </dl>
                          </Popover.Panel>
                        </Transition>
                      </Popover>
                    </div>
                  </Popover.Group>
                </div>
              </div>
            </>
          </div>
        </Card>
      </div>
    </Main>
  );
}
