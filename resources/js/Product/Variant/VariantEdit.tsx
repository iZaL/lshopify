import {Inertia} from '@inertiajs/inertia';
import {useForm} from '@inertiajs/inertia-react';
import React, {useEffect} from 'react';
import route from 'ziggy-js';

import BackButton from '../../components/BackButton';
import FormSubmitBar from '../../components/FormSubmitBar';
import PageHeader from '../../components/PageHeader';
import Main from '../../Main';
import {Image, Product, Variant} from '../../types';
import InventorySection from '../components/InventorySection';
import PricingSection from '../components/PricingSection';
import ShippingSection from '../components/ShippingSection';

import ProductInfo from './components/ProductInfo';
import VariantList from './components/VariantList';
import VariantOptionsEdit from './components/VariantOptionsEdit';

interface Props {
  product: Product;
  variant: Variant;
}

type Form = Variant & {
  images: Image[];
  _method: string;
};

export default function VariantEdit(props: Props) {
  const {product, variant} = props;

  const formData: Form = {
    ...variant,
    images: product.images || [],
    _method: 'PATCH',
  };

  const {data, setData, post, isDirty} = useForm(formData);

  useEffect(() => {
    console.log('data changed', data);
  }, [data]);

  useEffect(() => {
    setData('images', product.images || []);
  }, [product.images]);

  const onVariantItemClick = (v: Variant) => {
    const url = route('lshopify.products.variants.edit', [product.id, v.id]);
    return Inertia.get(url);
  };

  const onImagesUpload = (images: Image[]) => {
    const url = route('lshopify.products.images.store', [product.id]);
    const productData = {
      images,
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

  const handleSubmit = (): void => {
    const url = route('lshopify.products.variants.update', [variant.id]);
    console.log('d',data);
    Inertia.post(url,data, {
      preserveScroll: true,
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
              Inertia.get(route('lshopify.products.edit', [product.id]));
            }}
          />
          <PageHeader text={variant.title ?? 'Variant'} />
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-1 lg:col-start-1">
            <ProductInfo product={product} variant={variant} />
            <VariantList
              variants={product.variants || []}
              variant={variant}
              onVariantItemClick={onVariantItemClick}
            />
          </section>

          <section className="space-y-6 lg:col-span-2 lg:col-start-2">
            <VariantOptionsEdit
              variant={data}
              options={data.options || []}
              images={data.images || []}
              onImagesUpload={images => onImagesUpload(images)}
              onChange={(field, value: any) => setData(field, value)}
            />
            <PricingSection
              variant={data}
              onChange={(field, value) => setData(field, value)}
            />
            <InventorySection
              variant={data}
              onChange={(field, value: any) => setData(field, value)}
            />

            <ShippingSection
              variant={data}
              onChange={(field, value) => setData(field, value)}
            />
          </section>
        </div>
      </div>
    </Main>
  );
}
