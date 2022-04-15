import React, {useEffect} from 'react';
import Main from '../Main';
import PageHeader from '../components/PageHeader';
import TitleSection from './components/TitleSection';
import MediaSection from './components/MediaSection';
import PricingSection from './components/PricingSection';
import InventorySection from './components/InventorySection';
import ShippingSection from './components/ShippingSection';
import VariantSection from './components/VariantSection';
import StatusSection from './components/StatusSection';
import FormSubmitBar from '../components/FormSubmitBar';
import VariantEditSection from './components/VariantEditSection';
import {useForm} from '@inertiajs/inertia-react';
import {Inertia} from '@inertiajs/inertia';
import {
  Category,
  Collection,
  Image,
  Product,
  Tag,
  Variant,
  VariantOption,
  VariantValue,
  Vendor,
} from '../types';
import route from 'ziggy-js';
import BackButton from '../components/BackButton';
import Subheader from '../components/Subheader';
import Card from '../components/Card';
import Label from '../components/forms/Label';
import Border from '../components/Border';
import SingleSelect from '../components/SingleSelect';
import MultiSelect from '../components/MultiSelect';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import VariantsListSection from './components/VariantsListSection';

interface Props {
  product: Product;
  collection: Collection[];
  default_variant_options: VariantOption[];
  categories: Category[];
  variant_options: VariantOption[];
  tags: Tag[];
  vendors: Vendor[];
}

type Form = Product & {
  variant_options: VariantOption[];
  _method: string;
};

export default function ProductEdit(props: Props) {
  const {
    product,
    variant_options,
    default_variant_options,
    categories,
    collection,
    tags,
    vendors,
  } = props;

  const formProps: Form = {
    ...product,
    variant_options: variant_options,
    _method: 'PATCH',
  };

  const {data, setData, post, isDirty} = useForm<Form>(formProps);

  useEffect(() => {
    console.log('data changed', data);
  }, [data]);

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
    const url = route('lshopify.products.variants.edit', [
      product.id,
      variant.id,
    ]);
    return Inertia.get(url);
  };

  const onImagesUpload = (images: Image[]) => {
    const url = route('lshopify.images.store');
    const productData = {
      images: images,
      imageable_id: product.id,
      imageable_type: 'product',
    };
    setData('images', [...(data.images || []), ...images]);
    Inertia.post(url, productData, {
      onSuccess: () => {
        Inertia.reload();
      },
    });
  };

  const onVariantsDelete = (variantIDs: number[]) => {
    const url = route('lshopify.products.variants.delete', [product.id]);
    const productData = {
      variants: variantIDs,
    };
    Inertia.post(url, productData, {
      preserveState: false,
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
      preserveState: false,
      preserveScroll: false,
    });
  };

  const onImagesDelete = (images: Image[]) => {
    const url = route('lshopify.images.delete');
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
    Inertia.post(
      url,
      {
        name: value,
        product_id: product.id,
      },
      {
        preserveScroll: true,
        preserveState: false,
      },
    );
  };

  const onTagsCreate = (value: string) => {
    const url = route('lshopify.tags.store');
    Inertia.post(
      url,
      {
        name: value,
        taggable_id: product.id,
        taggable_type: 'product',
      },
      {
        preserveScroll: true,
        preserveState: false,
      },
    );
  };

  const onVendorCreate = (value: string) => {
    const url = route('lshopify.vendors.store');
    Inertia.post(
      url,
      {
        name: value,
        product_id: product.id,
      },
      {
        preserveScroll: true,
        preserveState: false,
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
              <VariantsListSection
                variantOptions={data.variant_options}
                currentVariants={data.variants || []}
                defaultVariantOptions={default_variant_options}
                images={data.images || []}
                onAddVariantClick={onAddVariantClick}
                onEditVariantClick={onEditVariantClick}
                onImagesUpload={images => onImagesUpload(images)}
                onVariantsDelete={variantIDs => onVariantsDelete(variantIDs)}
                onBulkAttributesSet={onBulkAttributesSet}
                onChange={variantIDs => setData('variants', variantIDs)}
                onDataSet={incomingData =>
                  setData({
                    ...data,
                    ...incomingData,
                  })
                }
              />
            ) : (
              data.default_variant && (
                <>
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
                    currentVariantOptions={data.default_variant?.options || []}
                    defaultVariantOptions={default_variant_options}
                    onChange={(field, value) =>
                      setDataObject('default_variant', field, value)
                    }
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

            <Card>
              <Subheader text={'Product Organization'} />

              <div className="text-sm sm:col-span-2 sm:mt-0">
                <Label title="Category" labelStyle="mb-1" />
                <SingleSelect
                  items={categories}
                  selectedItem={data.category ?? null}
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

//create
// options: Array(2)
// 0:
// id: "Color"
// name: "Color"
// values: Array(2)
// 0:
// id: "Black"
// name: "Black"
//   [[Prototype]]: Object
// 1:
// id: "Blue"
// name: "Blue"
