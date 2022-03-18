import React, {Fragment, useEffect, useState} from 'react';
import Main from '../Main';
import FormSubmitBar from '../components/FormSubmitBar';
import {useForm} from '@inertiajs/inertia-react';
import {Product, Tag, Variant} from '../types';
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
import Cell from './components/BulkEditor/Cell';

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
  seo_title: 'Page title',
  seo_url: 'URL and Handle',
  seo_description: 'Meta description',
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
  }, [products]);

  const [selectedProductAttributes, setSelectedProductAttributes] = useState<ProductAttributes[]>([
    'title',
    'status',
    'tags',
  ]);
  const [selectedVariantAttributes, setSelectedVariantAttributes] = useState<VariantAttributes[]>([
    'sku',
    'price',
    'compare_at_price',
  ]);

  const onButtonClick = (attribute: ProductAttributes | VariantAttributes) => {
    if (
      attribute === 'title' ||
      attribute === 'status' ||
      attribute === 'tags' ||
      attribute === 'seo_title' ||
      attribute === 'seo_url' ||
      attribute === 'seo_description'
    ) {
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

  const onTagAdd = (product: Product, value: string) => {
    const url = route('lshopify.tags.store');
    Inertia.post(
      url,
      {
        name: value,
        taggable_id: product.id,
        taggable_type: 'product',
      },
      {
        onSuccess: page => {
          Inertia.reload();
        },
      },
    );
  };
  const onTagRemove = (product: Product, tag: Tag) => {
    setData({
      products: data.products.map(p => {
        if (p.id === product.id) {
          return {
            ...p,
            tags: p.tags?.filter(t => t.id !== tag.id),
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

  const handleSubmit = (): void => {
    Inertia.post(route('lshopify.products.bulk.update'), data, {
      // preserveScroll: false,
      // preserveState: true,
      // onSuccess: () => {},
    });
  };

  const buttons: {[key: string]: Array<ProductAttributes | VariantAttributes>} = {
    General: ['title', 'status', 'tags'],
    Pricing: ['price', 'cost_price', 'compare_at_price', 'taxable'],
    Inventory: ['sku', 'barcode', 'quantity', 'out_of_stock_sale', 'track_quantity'],
    Shipping: ['weight', 'requires_shipping', 'hs_code'],
    SEO: ['seo_title', 'seo_description', 'seo_url'],
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
          <div className="inline-flex flex-wrap space-x-2 ">
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
                  hideIcon={attribute === 'title'}
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
                  <table className="table-auto divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        {selectedProductAttributes.map((attribute, idx) => (
                          <th key={idx} className="border py-2 text-sm font-normal">
                            {attributeLabels[attribute] ?? '-'}
                          </th>
                        ))}
                        {selectedVariantAttributes.map((attribute, idx) => (
                          <th key={idx} className="border py-2 text-sm font-normal">
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
                                  <Cell key={idx}>
                                    <ProductCell
                                      product={product}
                                      attribute={attribute}
                                      onChange={value =>
                                        onProductAttributeChange(product, attribute, value)
                                      }
                                      onTagAdd={value => onTagAdd(product, value)}
                                      onTagRemove={tag => onTagRemove(product, tag)}
                                    />
                                  </Cell>
                                );
                              })}

                              {!product.variants?.length && product.default_variant
                                ? selectedVariantAttributes.map((attribute, idx) => (
                                    <Cell key={idx}>
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
                                    </Cell>
                                  ))
                                : selectedVariantAttributes.map((attribute, idx) => (
                                    <Cell key={attribute}>
                                      <div className="cursor-not-allowed px-4">—</div>
                                    </Cell>
                                  ))}
                            </tr>
                            {product.variants?.map((variant, idx) => {
                              return (
                                <tr key={idx}>
                                  {selectedProductAttributes.map((attribute, idx) => (
                                    <Cell key={attribute}>
                                      {attribute === 'title' ? (
                                        <div className="bg-gray-100 p-2 pl-12 text-gray-500 ">
                                          {variant.title}
                                        </div>
                                      ) : (
                                        <div className="cursor-not-allowed px-4">—</div>
                                      )}
                                    </Cell>
                                  ))}
                                  {selectedVariantAttributes.map((attribute, idx) => (
                                    <Cell key={attribute}>
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
                                    </Cell>
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
