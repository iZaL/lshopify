import React, {useEffect, useState} from 'react';
import Main from '../Main';
import {navigationActiveState} from '../atoms';
import {useSetRecoilState} from 'recoil';
import PageHeader from '../components/PageHeader';
import TitleSection from './components/TitleSection';
import MediaSection from './components/MediaSection';
import PricingSection from './components/PricingSection';
import InventorySection from './components/InventorySection';
import ShippingSection from './components/ShippingSection';
import VariantSection from './components/VariantSection';
import StatusSection from './components/StatusSection';
import OrganizationSection from './components/OrganizationSection';
import FormSubmitBar from '../components/FormSubmitBar';
import {useForm} from '@inertiajs/inertia-react';
import {
  Collection,
  Image,
  Product,
  ProductType,
  Tag,
  VariantOption,
} from '../types';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';

interface Props {
  collection: Collection[];
  variants: VariantOption[];
  product_types: ProductType[];
  tags: Tag[];
}

export default function ProductCreate(props: Props) {
  const {tags, collection, variants, product_types} = props;

  const [isProductTypeLoading, setIsProductTypeLoading] = useState(false);
  const [isTagsLoading, setIsTagsLoading] = useState(false);

  const setNavigation = useSetRecoilState(navigationActiveState);
  const product: Product = {
    id: 0,
    title: 'Short sleeve t-shirt',
    description: '',
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
      origin_country_id: '',
      image: null,
      options: [],
      taxable: true,
      out_of_stock_sale: false,
      track_quantity: true,
      physical_product: true,
      requires_shipping: true,
    },
    status: 'draft',
    product_type: null,
    collections: [],
    images: [],
    tags: [],
  };
  const {data, setData, errors} = useForm({
    ...product,
  });

  useEffect(() => {
    setNavigation('Products');
  }, []);

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

  const handleSubmit = (): void => {
    // @ts-ignore
    Inertia.post(route('lshopify.products.store'), data, {
      preserveScroll: false,
      onSuccess: () => {},
    });
  };

  return (
    <Main>
      <div className="p-6">
        <FormSubmitBar onSubmit={handleSubmit} hide={false} />

        <PageHeader text={'Add Product'} />

        <div className="mt-6 max-w-3xl mx-auto grid grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 lg:col-start-1 lg:col-span-2 space-y-6">
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
              currentVariants={data.default_variant.options || []}
              defaultVariants={variants}
              onChange={(field, value) =>
                setDataObject('default_variant', field, value)
              }
            />
          </section>

          <section className="lg:col-start-3 lg:col-span-1 space-y-6">
            <StatusSection
              activeStatus={data.status}
              onChange={(field, value) => setData(field, value)}
            />
            <OrganizationSection
              productTypes={product_types}
              productType={data.product_type}
              defaultTags={tags}
              tags={data.tags || []}
              defaultCollection={collection}
              collection={data.collections || []}
              onProductTypeChange={value => setData('product_type', value)}
              setTags={collection => setData('tags', collection)}
              setCollection={collection => setData('collections', collection)}
              onProductTypeCreate={value => onProductTypeCreate(value)}
              isProductTypeLoading={isProductTypeLoading}
              isTagsLoading={isTagsLoading}
              onTagsCreate={value => onTagsCreate(value)}
            />
          </section>
        </div>
      </div>
    </Main>
  );
}
