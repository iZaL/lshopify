import React, {Fragment, useEffect, useState} from 'react';
import Main from '../Main';
import FormSubmitBar from '../components/FormSubmitBar';
import {useForm} from '@inertiajs/inertia-react';
import {Product, Variant} from '../types';
import Card from '../components/Card';
import TagClose from '../components/TagClose';
import BackButton from '../components/BackButton';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';
import PageHeader from '../components/PageHeader';
import ProductCell from './components/BulkEditor/ProductCell';
import VariantCell from './components/BulkEditor/VariantCell';
import {AttributeLabel, ProductAttributes, VariantAttributes} from './components/BulkEditor/types';
import TagsPopup from './components/BulkEditor/TagsPopup';

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

  const onProductAttributeChange = (
    product: Product,
    field: ProductAttributes | VariantAttributes,
    value: string,
  ) => {
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
              <TagsPopup
                buttons={buttons}
                attributeLabels={attributeLabels}
                onButtonClick={button => onButtonClick(button)}
                selectedAttributes={[...selectedVariantAttributes, ...selectedProductAttributes]}
              />

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
                                    <ProductCell
                                      product={product}
                                      attribute={attribute}
                                      onChange={value =>
                                        onProductAttributeChange(product, attribute, value)
                                      }
                                    />
                                  </td>
                                );
                              })}

                              {!product.variants?.length && product.default_variant
                                ? selectedVariantAttributes.map((attribute, idx) => (
                                    <td key={attribute} className="w-44 border text-sm font-normal">
                                      <VariantCell
                                        value={product.default_variant[attribute]}
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
                                      <VariantCell
                                        value={variant[attribute]}
                                        attribute={attribute}
                                        onChange={value =>
                                          onVariantAttributeChange(
                                            product,
                                            variant,
                                            attribute,
                                            value,
                                          )
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
