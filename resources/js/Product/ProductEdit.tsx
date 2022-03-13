import React, {useEffect, useState} from 'react';
import Main from '../Main';
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
import VariantEditSection from './components/VariantEditSection';
import {useForm} from '@inertiajs/inertia-react';
import {Inertia} from '@inertiajs/inertia';
import {Collection, Image, Product, ProductType, Tag, Variant, VariantOption} from '../types';
import route from 'ziggy-js';
import BackButton from '../components/BackButton';

interface Props {
  product: Product;
  collection: Collection[];
  variants: VariantOption[];
  product_types: ProductType[];
  variant_options: VariantOption[];
  variant_values: VariantOption[];
  tags: Tag[];
}

type Form = Product & {
  variant_options: VariantOption[];
  variant_values: VariantOption[];
  _method: string;
};

export default function ProductEdit(props: Props) {
  const {product, variant_options, variants, variant_values, product_types, collection, tags} =
    props;

  const formProps: Form = {
    ...product,
    variant_options: variant_options,
    variant_values: variant_values,
    _method: 'PATCH',
  };

  const {data, setData, post, isDirty} = useForm<Form>(formProps);

  const [isProductTypeLoading, setIsProductTypeLoading] = useState(false);
  const [isTagsLoading, setIsTagsLoading] = useState(false);

  useEffect(() => {
    setData({
      ...data,
      ...product,
    });
  }, [product]);

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

  const onAddVariantClick = () => {
    const url = route('lshopify.products.variants.create', [product.id]);
    return Inertia.get(url);
  };

  const onEditVariantClick = (variant: Variant) => {
    const url = route('lshopify.products.variants.edit', [product.id, variant.id]);
    return Inertia.get(url);
  };

  const onImagesUpload = (images: Image[]) => {
    const url = route('lshopify.products.images.store', [product.id]);
    const productData = {
      images: images,
    };
    setData('images', [...(data.images || []), ...images]);
    Inertia.post(url, productData, {
      onSuccess: () => {
        Inertia.reload();
      },
    });
  };

  const onVariantsDelete = (variantIDs: number[]) => {
    const url = route('lshopify.products.variants.destroy', [product.id]);
    const productData = {
      variants: variantIDs,
    };
    Inertia.post(url, productData, {
      preserveScroll: false,
      onSuccess: () => {
        Inertia.reload();
      },
    });
  };

  const onBulkAttributesSet = <T extends keyof Variant>(
    variantIDs: number[],
    field: T,
    value: Variant[T],
  ) => {
    const url = route('lshopify.products.variants.attributes', [product.id]);
    const productData = {
      variants: variantIDs,
      field: field,
      value: value,
    };
    Inertia.post(url, productData, {
      preserveScroll: false,
      onSuccess: () => {
        Inertia.reload();
      },
    });
  };

  const onImagesDelete = (images: Image[]) => {
    const url = route('lshopify.products.images.destroy', [product.id]);
    const productData = {
      images: images,
    };
    Inertia.post(url, productData, {
      onSuccess: () => {
        Inertia.reload();
      },
    });
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
    const url = route('lshopify.products.update', [product.id]);
    post(url, {
      preserveScroll: false,
      preserveState: false,
      onSuccess: () => {},
    });
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
          <PageHeader text={product.title} />
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 space-y-6 lg:col-span-2 lg:col-start-1">
            <TitleSection
              title={data.title}
              description={data.description}
              onChange={(field, value) => setData(field, value)}
            />

            <MediaSection
              images={data.images || []}
              onImagesDelete={images => onImagesDelete(images)}
              onImagesUpload={images => onImagesUpload(images)}
            />

            {product.variants?.length ? (
              <VariantEditSection
                currentVariants={data.variants || []}
                variantOptions={data.variant_options || []}
                variantValues={data.variant_values || []}
                images={data.images || []}
                onAddVariantClick={onAddVariantClick}
                onEditVariantClick={onEditVariantClick}
                onImagesUpload={images => onImagesUpload(images)}
                onVariantsDelete={variantIDs => onVariantsDelete(variantIDs)}
                onBulkAttributesSet={onBulkAttributesSet}
                onChange={variantIDs => setData('variants', variantIDs)}
              />
            ) : (
              data.default_variant && (
                <>
                  <PricingSection
                    variant={data.default_variant}
                    onChange={(field, value) => setDataObject('default_variant', field, value)}
                  />
                  <InventorySection
                    variant={data.default_variant}
                    onChange={(field, value) => setDataObject('default_variant', field, value)}
                  />
                  <ShippingSection
                    variant={data.default_variant}
                    onChange={(field, value) => setDataObject('default_variant', field, value)}
                  />
                  <VariantSection
                    currentVariants={data.default_variant?.options || []}
                    defaultVariants={variants}
                    onChange={(field, value) => setDataObject('default_variant', field, value)}
                  />
                </>
              )
            )}
          </section>

          <section className="space-y-6 lg:col-span-1 lg:col-start-3">
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
              isProductTypeLoading={isProductTypeLoading}
              isTagsLoading={isTagsLoading}
              onProductTypeChange={record => setData('product_type', record)}
              setTags={tagCollection => setData('tags', tagCollection)}
              setCollection={collectionCollection => setData('collections', collectionCollection)}
              onTagsCreate={value => onTagsCreate(value)}
              onProductTypeCreate={value => onProductTypeCreate(value)}
            />
          </section>
        </div>
      </div>
    </Main>
  );
}
