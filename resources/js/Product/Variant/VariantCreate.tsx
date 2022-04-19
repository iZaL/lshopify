import {Inertia} from '@inertiajs/inertia';
import {useForm} from '@inertiajs/inertia-react';
import React, {useEffect} from 'react';
import route from 'ziggy-js';
import BackButton from '../../components/BackButton';
import FormSubmitBar from '../../components/FormSubmitBar';
import PageHeader from '../../components/PageHeader';
import Main from '../../Main';
import {Image, Product, Variant, VariantOption} from '../../types';
import InventorySection from '../components/InventorySection';
import PricingSection from '../components/PricingSection';
import ShippingSection from '../components/ShippingSection';
import ProductInfo from './components/ProductInfo';
import VariantList from './components/VariantList';
import VariantOptionsEdit from './components/VariantOptionsEdit';

interface Props {
  product: Product;
  variant_options: VariantOption[];
}

export default function VariantCreate(props: Props) {
  const {product, variant_options} = props;

  const options = variant_options.map((o): VariantOption => ({
      name: '',
      id: o.id,
    }));

  const {data, setData, post} = useForm<Variant & {images: Image[]}>({
    origin_country_id: '',
    id: 0,
    price: '0',
    compare_at_price: '0',
    cost_price: '0',
    quantity: '0',
    sku: '',
    barcode: '',
    image: null,
    weight: '',
    hs_code: '',
    options,
    taxable: false,
    tracked: false,
    out_of_stock_sale: true,
    physical_product: true,
    requires_shipping: true,
    images: product.images || [],
  });

  useEffect(() => {
    setData('images', product.images || []);
  }, [product.images]);

  const onVariantItemClick = (v: Variant) => Inertia.get(
      route('lshopify.products.variants.edit', [product.id, v.id]),
    );

  const onImagesUpload = (images: Image[]) => {
    const url = route('lshopify.images.store');
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
    const url = route('lshopify.products.variants.store', [product.id]);
    post(url, {
      preserveScroll: false,
    });
  };

  return (
    <Main>
      <div className="p-6">
        <FormSubmitBar onSubmit={handleSubmit} />

        <div className="flex flex-row items-center space-x-2">
          <BackButton
            onClick={() => {
              Inertia.get(route('lshopify.products.edit', [product.id]));
            }}
          />
          <PageHeader text="Add Variant" />
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-1 lg:col-start-1">
            <ProductInfo product={product} variant={product.default_variant} />
            <VariantList
              variants={product.variants || []}
              variant={undefined}
              onVariantItemClick={onVariantItemClick}
            />
          </section>

          <section className="space-y-6 lg:col-span-2 lg:col-start-2">
            <VariantOptionsEdit
              variant={data}
              options={data.options || []}
              images={data.images}
              onChange={(field, value: any) => setData(field, value)}
              onImagesUpload={images => onImagesUpload(images)}
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
