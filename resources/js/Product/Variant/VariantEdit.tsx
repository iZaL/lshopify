import React, {useEffect} from 'react';
import Main from '../../Main';
import PageHeader from '../../components/PageHeader';
import {Image, Product, Variant} from '../../types';
import {useForm} from '@inertiajs/inertia-react';
import VariantOptionsEdit from './components/VariantOptionsEdit';
import {Inertia} from '@inertiajs/inertia';
import FormSubmitBar from '../../components/FormSubmitBar';
import VariantList from './components/VariantList';
import PricingSection from '../components/PricingSection';
import ProductInfo from './components/ProductInfo';
import InventorySection from '../components/InventorySection';
import ShippingSection from '../components/ShippingSection';
import route from 'ziggy-js';

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

  const {data, setData, post} = useForm(formData);

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
      images: images,
    };
    setData('images', [...(data.images || []), ...images]);
    Inertia.post(url, productData, {
      onSuccess: () => {
        Inertia.reload();
      },
    });
  };

  const handleSubmit = (): void => {
    const url = route('lshopify.products.variants.store', [product.id]);
    post(url, {
      preserveScroll: false,
      preserveState: true,
      onSuccess: () => {},
    });
  };

  return (
    <Main>
      <div className="p-6">
        <FormSubmitBar onSubmit={handleSubmit} />

        <PageHeader text={variant.title ?? 'Variant'} />

        <div className="mt-6 max-w-3xl mx-auto grid grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 lg:col-start-1 lg:col-span-1">
            <ProductInfo product={product} variant={variant} />
            <VariantList
              variants={product.variants || []}
              variant={variant}
              onVariantItemClick={onVariantItemClick}
            />
          </section>

          <section className="lg:col-start-2 lg:col-span-2 space-y-6">
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
