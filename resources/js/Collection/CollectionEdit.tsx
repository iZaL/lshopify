import React, {useEffect} from 'react';
import Main from '../Main';
import PageHeader from '../components/PageHeader';
import TitleSection from './components/TitleSection';
import FormSubmitBar from '../components/FormSubmitBar';
import {Collection, Product} from '../types';
import {Inertia} from '@inertiajs/inertia';
import ProductSection from './components/ProductSection';
import {useForm} from '@inertiajs/inertia-react';
import ProductAddSection from './components/ProductAddSection';
import route from 'ziggy-js';

interface Props {
  collection: Collection;
  products: Product[];
}

export default function CollectionEdit(props: Props) {
  const {collection, products} = props;

  const {data, setData, isDirty} = useForm<
    Collection & {searchTerm: string; sortTerm: string}
  >({
    ...collection,
    searchTerm: '',
    sortTerm: '',
  });

  useEffect(() => {
    setData({
      ...data,
      products: collection.products,
    });
  }, [collection.products]);

  const onAddProductsToCollection = (productIDs: number[]) => {
    const url = route('lshopify.collections.products.update', [collection.id]);
    Inertia.post(
      url,
      {
        products: productIDs,
      },
      {
        onSuccess: () => {
          Inertia.reload();
        },
      },
    );
  };

  const handleSubmit = () => {
    const url = route('lshopify.collections.update', [collection.id]);

    Inertia.post(
      url,
      {
        ...data,
        _method: 'PATCH',
      },
      {
        onSuccess: () => {
          Inertia.reload();
        },
      },
    );
  };

  return (
    <Main>
      <div className="p-6">
        <FormSubmitBar onSubmit={handleSubmit} show={isDirty} />

        <PageHeader text={collection.name} />

        <div className="mt-6 max-w-3xl mx-auto grid grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 lg:col-start-1 lg:col-span-2 space-y-6">
            <TitleSection
              name={data.name}
              description={data.description || ''}
              onChange={(field, value) => setData(field, value)}
            />
            {collection.type === 'manual' ? (
              <ProductAddSection
                searchTerm={data.searchTerm}
                sortTerm={data.sortTerm}
                products={products}
                collectionProducts={data.products || []}
                onChange={(field, value) => setData(field, value)}
                onAddProducts={onAddProductsToCollection}
              />
            ) : (
              <ProductSection
                sortTerm={data.sortTerm}
                collectionProducts={data.products || []}
              />
            )}
          </section>
        </div>
      </div>
    </Main>
  );
}
