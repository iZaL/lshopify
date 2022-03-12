import React, {Fragment, useState} from 'react';
import Main from '../Main';
import FormSubmitBar from '../components/FormSubmitBar';
import {useForm} from '@inertiajs/inertia-react';
import {Product, Variant} from '../types';
import Card from '../components/Card';
import TagClose from '../components/TagClose';
import {Popover, Transition} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/solid';
import Button from '../components/Button';
import Border from '../components/Border';
import BackButton from '../components/BackButton';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';
import PageHeader from '../components/PageHeader';

interface Props {
  products: Product[];
}

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  buttonStyle?: string;
}

type Form = {
  products: Product[];
};

type Attributes = {
  [name in keyof Product | keyof Variant]: string;
};

type AttributeLabel = Partial<Attributes>;

interface AttributeButton extends ButtonProps {
  title: keyof AttributeLabel;
}

export default function ProductBulkEdit(props: Props) {
  const {products} = props;

  const formProps: Form = {
    products: products,
  };

  const {data, setData, post, isDirty} = useForm<Form>(formProps);

  const defaultProductAttributes: Array<keyof Product> = ['title'];
  const defaultVariantAttributes: Array<keyof Variant> = [
    'sku',
    'price',
    'compare_at_price',
  ];

  const [selectedProductAttributes, setSelectedProductAttributes] = useState<
    Array<keyof Product>
    >(defaultProductAttributes);
  const [selectedVariantAttributes, setSelectedVariantAttributes] = useState<
    Array<keyof Variant>
    >(defaultVariantAttributes);

  const attributeLabels: AttributeLabel = {
    title: 'Title',
    status: 'Status',
    tags: 'Tags',
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

  const AttributeButton = (props: AttributeButton) => {
    const title = attributeLabels[props.title] ?? null;

    const selectedAttributes = [
      ...selectedVariantAttributes,
      ...selectedProductAttributes,
    ];

    return (
      <Button
        {...props}
        theme="default"
        buttonStyle={`${props.buttonStyle} px-2 py-1 `}
        disabled={title ? selectedAttributes.includes(props.title) : false}>
        {title}
      </Button>
    );
  };

  const onProductButtonClick = (attribute: keyof Product) => {
    if (selectedProductAttributes.includes(attribute)) {
      setSelectedProductAttributes(
        selectedProductAttributes.filter(item => item !== attribute),
      );
    } else {
      setSelectedProductAttributes([...selectedProductAttributes, attribute]);
    }
  };

  const onVariantButtonClick = (attribute: keyof Variant) => {
    if (selectedVariantAttributes.includes(attribute)) {
      setSelectedVariantAttributes(
        selectedVariantAttributes.filter(item => item !== attribute),
      );
    } else {
      setSelectedVariantAttributes([...selectedVariantAttributes, attribute]);
    }
  };

  const handleSubmit = (): void => {};

  const people = [
    {
      name: 'Lindsay Walton',
      title: 'Front-end Developer',
      email: 'lindsay.walton@example.com',
      role: 'Member',
    },
    // More people...
  ];
  return (
    <Main>
      <div className="p-6">
        <FormSubmitBar onSubmit={handleSubmit} show={isDirty} />
        <div className="flex flex-row items-center space-x-2">
          <BackButton
            onClick={() => {
              Inertia.get(route('lshopify.products.index'));
            }}
          />
          <PageHeader text="Bulk Editor" />
        </div>

        <Card cardStyle="mt-6">
          <div className="text-sm text-gray-700">
            Currently editing these fields:
          </div>
          <div className="inline-flex flex-wrap space-x-2 space-y-2">
            <>
              <div className="col-span-12 mt-2 ml-2 sm:col-span-6">
                <div className="relative z-0 inline-flex rounded-md shadow-sm sm:space-x-3 sm:shadow-none">
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
                          <Popover.Panel className="absolute left-0 mt-2 max-h-[20rem] w-[36rem] origin-top-right overflow-y-scroll rounded-md bg-white p-2 text-sm shadow shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none ">
                            <dl>
                              <div className="items-center py-2 sm:grid sm:grid-cols-4">
                                <dt>General</dt>
                                <dd className="mt-1 space-x-1 space-y-2 text-gray-900 sm:col-span-3 sm:mt-0">
                                  <AttributeButton
                                    title="title"
                                    buttonStyle="ml-1"
                                    onClick={() =>
                                      onProductButtonClick('title')
                                    }
                                  />
                                  <AttributeButton
                                    title="tags"
                                    onClick={() => onProductButtonClick('tags')}
                                  />
                                  <AttributeButton
                                    title="status"
                                    onClick={() =>
                                      onProductButtonClick('status')
                                    }
                                  />
                                </dd>
                              </div>
                            </dl>

                            <Border borderStyle="my-0" />

                            <dl>
                              <div className="items-center py-2 sm:grid sm:grid-cols-4">
                                <dt>Pricing</dt>
                                <dd className="mt-1 space-x-1 space-y-2 text-gray-900 sm:col-span-3 sm:mt-0">
                                  <AttributeButton
                                    title="price"
                                    buttonStyle="ml-1"
                                    onClick={() =>
                                      onVariantButtonClick('price')
                                    }
                                  />
                                  <AttributeButton
                                    title="compare_at_price"
                                    onClick={() =>
                                      onVariantButtonClick('compare_at_price')
                                    }
                                  />
                                  <AttributeButton
                                    title="cost_price"
                                    onClick={() =>
                                      onVariantButtonClick('cost_price')
                                    }
                                  />
                                  <AttributeButton
                                    title="taxable"
                                    onClick={() =>
                                      onVariantButtonClick('taxable')
                                    }
                                  />
                                </dd>
                              </div>
                            </dl>

                            <Border borderStyle="my-0" />

                            <dl>
                              <div className="items-center py-2 sm:grid sm:grid-cols-4">
                                <dt>Inventory</dt>
                                <dd className="mt-1 space-x-1 space-y-2 text-gray-900 sm:col-span-3 sm:mt-0">
                                  <AttributeButton
                                    title="sku"
                                    buttonStyle="ml-1"
                                    onClick={() => onVariantButtonClick('sku')}
                                  />
                                  <AttributeButton
                                    title="barcode"
                                    onClick={() =>
                                      onVariantButtonClick('barcode')
                                    }
                                  />
                                  <AttributeButton
                                    title="quantity"
                                    onClick={() =>
                                      onVariantButtonClick('quantity')
                                    }
                                  />

                                  <AttributeButton
                                    title="out_of_stock_sale"
                                    onClick={() =>
                                      onVariantButtonClick('out_of_stock_sale')
                                    }
                                  />
                                  <AttributeButton
                                    title="track_quantity"
                                    onClick={() =>
                                      onVariantButtonClick('track_quantity')
                                    }
                                  />
                                </dd>
                              </div>
                            </dl>

                            <Border borderStyle="my-0" />

                            <dl>
                              <div className="items-center py-2 sm:grid sm:grid-cols-4">
                                <dt>Shipping</dt>
                                <dd className="mt-1 space-x-1 space-y-2 text-gray-900 sm:col-span-3 sm:mt-0">
                                  <AttributeButton
                                    title="weight"
                                    buttonStyle="ml-1"
                                    onClick={() =>
                                      onVariantButtonClick('weight')
                                    }
                                  />

                                  <AttributeButton
                                    title="requires_shipping"
                                    onClick={() =>
                                      onVariantButtonClick('requires_shipping')
                                    }
                                  />

                                  <AttributeButton
                                    title="hs_code"
                                    onClick={() =>
                                      onVariantButtonClick('hs_code')
                                    }
                                  />
                                  <AttributeButton
                                    title="origin_country_id"
                                    onClick={() =>
                                      onVariantButtonClick('origin_country_id')
                                    }
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

              {selectedProductAttributes.map((attribute, idx) => (
                <TagClose
                  key={idx}
                  title={attributeLabels[attribute] ?? '-'}
                  onClick={() => onProductButtonClick(attribute)}
                />
              ))}
              {selectedVariantAttributes.map((attribute, idx) => (
                <TagClose
                  key={idx}
                  title={attributeLabels[attribute] ?? '-'}
                  onClick={() => onVariantButtonClick(attribute)}
                />
              ))}
            </>
          </div>

          <div className="-mx-4 flex flex-col">
            <div className="overflow-x-auto">
              <div className="inline-block w-full py-2 align-middle">
                <div className="shadow-sm ring-1 ring-black ring-opacity-5">
                  <table className="w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                    <tr>
                      {selectedProductAttributes.map(attribute => (
                        <th
                          key={attribute}
                          className="border px-4 py-2 text-sm font-normal">
                          {attributeLabels[attribute] ?? '-'}
                        </th>
                      ))}
                      {selectedVariantAttributes.map(attribute => (
                        <th
                          key={attribute}
                          className="border px-4 py-2 text-sm font-normal">
                          {attributeLabels[attribute] ?? '-'}
                        </th>
                      ))}
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(product => (
                      <>
                        <tr key={product.id}>
                          {selectedProductAttributes.map(attribute => (
                            <td
                              key={attribute}
                              className="w-44 border px-4 py-2 text-sm font-normal">
                              {product[attribute] ?? '-'}
                            </td>
                          ))}
                          {
                            selectedVariantAttributes.map((attribute,idx) => (
                              <td
                                key={idx}
                                className="w-44 border px-4 py-2 text-sm font-normal">
                                --
                              </td>
                            ))
                          }
                        </tr>
                        {product.variants?.map(variant => (
                          <tr>
                            {
                              selectedProductAttributes.map((product,idx) => (
                                <td key={idx} className="w-44 border px-12 py-2 text-sm font-normal text-gray-500">{variant.title}</td>
                              ))
                            }
                            {selectedVariantAttributes.map(attribute => (
                              <td
                                key={attribute}
                                className="w-44 border px-4 py-2 text-sm font-normal">
                                {variant[attribute] ?? '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Main>
  );
}
