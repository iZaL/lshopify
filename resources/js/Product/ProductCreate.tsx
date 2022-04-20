import {Inertia} from '@inertiajs/inertia';
import {useForm} from '@inertiajs/inertia-react';
import React, {useEffect, useState} from 'react';
import route from 'ziggy-js';

import Border from '../components/Border';
import Card from '../components/Card';
import Label from '../components/forms/Label';
import FormSubmitBar from '../components/FormSubmitBar';
import MultiSelect from '../components/MultiSelect';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import PageHeader from '../components/PageHeader';
import SingleSelect from '../components/SingleSelect';
import Subheader from '../components/Subheader';
import Main from '../Main';
import {
  Category,
  Collection,
  Image,
  Product,
  Tag,
  VariantOption,
  Vendor,
} from '../types';

import InventorySection from './components/InventorySection';
import MediaSection from './components/MediaSection';
import PricingSection from './components/PricingSection';
import ShippingSection from './components/ShippingSection';
import StatusSection from './components/StatusSection';
import TitleSection from './components/TitleSection';
import VariantSection from './components/VariantSection';

interface Props {
  collection: Collection[];
  default_variant_options: VariantOption[];
  categories: Category[];
  tags: Tag[];
  vendors: Vendor[];
}

export default function ProductCreate(props: Props) {
  const {tags, collection, default_variant_options, categories, vendors} =
    props;

  const [isProductTypeLoading, setIsProductTypeLoading] = useState(false);
  const [isTagsLoading, setIsTagsLoading] = useState(false);

  const product: Product = {
    id: 0,
    title: 'Short sleeve t-shirt',
    description: '',
    available_quantity: '',
    default_variant: {
      id: 0,
      price: '0',
      compare_at_price: '0',
      cost_price: '0',
      quantity: '0',
      sku: '',
      barcode: '',
      weight: '',
      hs_code: '',
      image: null,
      options: [],
      taxable: true,
      out_of_stock_sale: false,
      tracked: true,
      physical_product: true,
      requires_shipping: true,
      origin_country_id: '',
    },
    status: 'draft',
    collections: [],
    images: [],
    tags: [],
  };
  const {data, setData, isDirty} = useForm({
    ...product,
  });

  useEffect(() => {
    console.log('data changed', data);
  }, [data]);

  const setDataObject = <T extends keyof Product, K extends keyof Product[T]>(
    objectKey: T,
    fieldKey: K,
    value: Product[T][K],
  ) => {
    setData({
      ...data,
      [objectKey]: {
        ...(data[objectKey] as {}),
        [fieldKey]: value,
      },
    });
  };

  const onImagesUpload = (images: Image[]) => {
    setData('images', [...(data.images || []), ...images]);
  };

  const onImagesDelete = (images: Image[]) => {
    const deletingImageIDs = images.map(img => img.id);
    const currentImages = data.images?.filter(
      img => !deletingImageIDs.includes(img.id),
    );
    setData('images', currentImages);
  };

  const onProductTypeCreate = (value: string) => {
    const url = route('lshopify.categories.store');
    setIsProductTypeLoading(true);
    Inertia.post(
      url,
      {name: value},
      {
        onSuccess: () => {
          setIsProductTypeLoading(false);
          Inertia.reload();
        },
      },
    );
  };

  const onTagsCreate = (value: string) => {
    const url = route('lshopify.tags.store');
    setIsTagsLoading(true);
    Inertia.post(
      url,
      {name: value},
      {
        onSuccess: () => {
          setIsTagsLoading(false);
          Inertia.reload();
        },
      },
    );
  };

  const onVendorCreate = (value: string) => {
    const url = route('lshopify.vendors.store');
    Inertia.post(
      url,
      {name: value},
      {
        onSuccess: () => {
          Inertia.reload();
        },
      },
    );
  };

  const handleSubmit = (): void => {
    Inertia.post(route('lshopify.products.store'), data, {
      preserveScroll: false,
      onSuccess: () => {},
    });
  };

  return (
    <Main>
      <div className="p-6">
        <FormSubmitBar onSubmit={handleSubmit} show={isDirty} />

        <PageHeader text="Add Product" />

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2 lg:col-start-1">
            <TitleSection
              title={data.title}
              description={data.description}
              onChange={(field, value) => setData(field, value)}
            />
            <MediaSection
              onImagesDelete={images => onImagesDelete(images)}
              images={data.images || []}
              onImagesUpload={images => onImagesUpload(images)}
            />
            <PricingSection
              variant={data.default_variant}
              onChange={(field, value) =>
                setDataObject('default_variant', field, value)
              }
            />
            <InventorySection
              variant={data.default_variant}
              onChange={(field, value) =>
                setDataObject('default_variant', field, value)
              }
            />
            <ShippingSection
              variant={data.default_variant}
              onChange={(field, value) =>
                setDataObject('default_variant', field, value)
              }
            />
            <VariantSection
              currentVariantOptions={data.default_variant.options || []}
              defaultVariantOptions={default_variant_options}
              onChange={(field, value) =>
                setDataObject('default_variant', field, value)
              }
            />
          </section>

          <section className="space-y-6 lg:col-span-1 lg:col-start-3">
            <StatusSection
              activeStatus={data.status}
              onChange={(field, value) => setData(field, value)}
            />

            <Card>
              <Subheader text="Product Organization" />

              <div className="text-sm sm:col-span-2 sm:mt-0">
                <Label title="Type" labelStyle="mb-1" />
                <SingleSelect
                  items={categories}
                  selectedItem={data.category ?? null}
                  isLoading={isProductTypeLoading}
                  onChange={record => setData('category', record)}
                  onCreate={value => onProductTypeCreate(value)}
                />
              </div>

              <Border />

              <div className="text-sm sm:col-span-2 sm:mt-0">
                <Label title="Vendor" labelStyle="mb-1" />
                <SingleSelect
                  items={vendors}
                  selectedItem={data.vendor ?? null}
                  onChange={record => setData('vendor', record)}
                  onCreate={value => onVendorCreate(value)}
                />
              </div>

              <Border />

              <div>
                <Label title="Collections" labelStyle="mb-1" />
                <MultiSelectDropdown
                  items={collection}
                  selectedItems={data.collections || []}
                  onChange={collectionCollection =>
                    setData('collections', collectionCollection)
                  }
                />
              </div>

              <Border />

              <div>
                <Label title="Tags" labelStyle="mb-1" />
                <MultiSelect
                  items={tags}
                  selectedItems={data.tags || []}
                  isLoading={isTagsLoading}
                  onChange={tagCollection => setData('tags', tagCollection)}
                  onCreate={value => onTagsCreate(value)}
                />
              </div>
            </Card>
          </section>
        </div>
      </div>
    </Main>
  );
}
