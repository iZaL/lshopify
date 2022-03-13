import React, {Fragment, useEffect, useState} from 'react';
import Main from '../Main';
import FormSubmitBar from '../components/FormSubmitBar';
import {useForm} from '@inertiajs/inertia-react';
import {Product, Variant} from '../types';
import Card from '../components/Card';
import TagClose from '../components/TagClose';
import {Popover, Transition} from '@headlessui/react';
import {ChevronDownIcon} from '@heroicons/react/solid';
import BackButton from '../components/BackButton';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';
import PageHeader from '../components/PageHeader';
import ProductChange from './components/BulkEditor/ProductChange';
import VariantChange from './components/BulkEditor/VariantChange';
import {AttributeLabel} from './components/BulkEditor/types';
import Button from '../components/Button';

interface Props {
  products: Product[];
}

type Form = {
  products: Product[];
};

const attributeLabels: AttributeLabel = {
  title: 'Title',
  status: 'Status',
  tags: 'Tags',
  price: 'Price',
  compare_at_price: 'Compare at price',
  cost_price: 'Cost per item',
  sku: 'SKU',
  barcode: 'Barcode',
  weight: 'Weight',
  quantity: 'Quantity',
  requires_shipping: 'Requires shipping',
  taxable: 'Charge taxes',
  hs_code: 'HS code',
  track_quantity: 'Track Quantity',
  out_of_stock_sale: 'Continue selling when out of stock',
  origin_country_id: 'Country of origin',
};

type ProductAttributes = 'title' | 'status' | 'tags';
type VariantAttributes =
  | 'price'
  | 'compare_at_price'
  | 'cost_price'
  | 'sku'
  | 'barcode'
  | 'weight'
  | 'quantity'
  | 'requires_shipping'
  | 'taxable'
  | 'hs_code'
  | 'track_quantity'
  | 'out_of_stock_sale'
  | 'origin_country_id';

export default function ProductBulkEdit(props: Props) {
  const {products} = props;

  const formProps: Form = {
    products: products,
  };

  const {data, setData, post, isDirty} = useForm<Form>(formProps);

  useEffect(() => {
    setData({
      products: products,
    });
  }, []);

  const [selectedProductAttributes, setSelectedProductAttributes] = useState<ProductAttributes[]>([
    'title',
    'status',
  ]);
  const [selectedVariantAttributes, setSelectedVariantAttributes] = useState<VariantAttributes[]>([
    'sku',
    'price',
    'compare_at_price',
  ]);

  const onButtonClick = (attribute: ProductAttributes | VariantAttributes) => {
    if (attribute === 'title' || attribute === 'status' || attribute === 'tags') {
      onProductButtonClick(attribute);
    } else {
      onVariantButtonClick(attribute);
    }
  };

  const onProductButtonClick = (attribute: ProductAttributes) => {
    if (selectedProductAttributes.includes(attribute)) {
      setSelectedProductAttributes(selectedProductAttributes.filter(item => item !== attribute));
    } else {
      setSelectedProductAttributes([...selectedProductAttributes, attribute]);
    }
  };

  const onVariantButtonClick = (attribute: VariantAttributes) => {
    if (selectedVariantAttributes.includes(attribute)) {
      setSelectedVariantAttributes(selectedVariantAttributes.filter(item => item !== attribute));
    } else {
      setSelectedVariantAttributes([...selectedVariantAttributes, attribute]);
    }
  };

  const onProductAttributeChange = (product: Product, field: ProductAttributes | VariantAttributes, value: string) => {
    setData({
      products: data.products.map(p => {
        if (p.id === product.id) {
          return {
            ...p,
            [field]: value,
          };
        }
        return p;
      }),
    });
  };

  const onVariantAttributeChange = <T extends keyof Variant>(
    product: Product,
    variant: Variant,
    attribute: T,
    value: Variant[T],
  ) => {
    if (product && product.variants) {
      const newProduct = {
        ...product,
        variants: product.variants.map(v => {
          if (v.id === variant.id) {
            return {
              ...variant,
              [attribute]: value,
            };
          }
          return v;
        }),
      };
      // update data products with new product
      setData({
        products: data.products.map(p => {
          if (p.id === product.id) {
            return newProduct;
          }
          return p;
        }),
      });
    }
  };
  const onDefaultVariantAttributeChange = <T extends keyof Variant>(
    product: Product,
    variant: Variant,
    attribute: T,
    value: Variant[T],
  ) => {
    if (product && product.variants) {
      const newProduct = {
        ...product,
        default_variant: {
          ...product.default_variant,
          [attribute]: value,
        },
      };

      // update data products with new product
      setData({
        products: data.products.map(p => {
          if (p.id === product.id) {
            return newProduct;
          }
          return p;
        }),
      });
    }
  };

  const handleSubmit = (): void => {};

  const selectedAttributes = [...selectedVariantAttributes, ...selectedProductAttributes];

  const buttons: {[key: string]: Array<ProductAttributes | VariantAttributes>} = {
    General: ['title', 'status', 'tags'],
    Pricing: ['price', 'cost_price', 'compare_at_price', 'taxable'],
    Inventory: ['sku', 'barcode', 'quantity', 'out_of_stock_sale', 'track_quantity'],
    Shipping: ['weight', 'requires_shipping', 'hs_code'],
  };

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
          <div className="text-sm text-gray-700">Currently editing these fields:</div>
          <div className="inline-flex flex-wrap space-x-2 space-y-2">
            <>
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
                          <Popover.Panel className="absolute left-0 mt-2 max-h-[20rem] w-[36rem] origin-top-right overflow-y-scroll rounded-md bg-white p-2 text-sm shadow shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none divide-y ">
                            {Object.keys(buttons).map((key, idx) => {
                              return (
                                <dl key={idx} className='divide-y divide-black'>
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
                        {selectedProductAttributes.map((attribute, idx) => (
                          <th key={idx} className="border px-4 py-2 text-sm font-normal">
                            {attributeLabels[attribute] ?? '-'}
                          </th>
                        ))}
                        {selectedVariantAttributes.map((attribute, idx) => (
                          <th key={idx} className="border px-4 py-2 text-sm font-normal">
                            {attributeLabels[attribute] ?? '-'}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.products.map((product, idx) => {
                        return (
                          <Fragment key={idx}>
                            <tr>
                              {selectedProductAttributes.map((attribute, idx) => {
                                return (
                                  <td key={attribute} className="w-44 border text-sm font-normal">
                                    <ProductChange
                                      product={product}
                                      attribute={attribute}
                                      onChange={value => onProductAttributeChange(product, attribute, value)}
                                    />
                                  </td>
                                );
                              })}

                              {!product.variants?.length && product.default_variant
                                ? selectedVariantAttributes.map((attribute, idx) => (
                                    <td key={attribute} className="w-44 border text-sm font-normal">
                                      <VariantChange
                                        variant={product.default_variant}
                                        attribute={attribute}
                                        onChange={value =>
                                          onDefaultVariantAttributeChange(
                                            product,
                                            product.default_variant,
                                            attribute,
                                            value,
                                          )
                                        }
                                      />
                                    </td>
                                  ))
                                : selectedVariantAttributes.map((attribute, idx) => (
                                    <td
                                      key={attribute}
                                      className="w-44 border px-4 text-sm font-normal">
                                      --
                                    </td>
                                  ))}
                            </tr>
                            {product.variants?.map((variant, idx) => {
                              return (
                                <tr key={idx}>
                                  {selectedProductAttributes.map((attribute, idx) => (
                                    <td
                                      key={attribute}
                                      className="w-44 border px-4 text-sm font-normal">
                                      {attribute === 'title' ? (
                                        <div className="px-12 text-gray-500 ">{variant.title}</div>
                                      ) : (
                                        '--'
                                      )}
                                    </td>
                                  ))}
                                  {selectedVariantAttributes.map((attribute, idx) => (
                                    <td key={attribute} className="w-44 border text-sm font-normal">
                                      <VariantChange
                                        variant={variant}
                                        attribute={attribute}
                                        onChange={value =>
                                          onVariantAttributeChange(product, variant, attribute, value)
                                        }
                                      />
                                    </td>
                                  ))}
                                </tr>
                              );
                            })}
                          </Fragment>
                        );
                      })}
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
