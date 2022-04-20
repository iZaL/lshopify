import {Inertia} from '@inertiajs/inertia';
import {useForm} from '@inertiajs/inertia-react';
import React, {useEffect} from 'react';
import route from 'ziggy-js';

import {deleteImages, uploadImages} from '../api';
import BackButton from '../components/BackButton';
import Card from '../components/Card';
import FormSubmitBar from '../components/FormSubmitBar';
import ImageSelect from '../components/ImageSelect';
import PageHeader from '../components/PageHeader';
import Main from '../Main';
import {Collection, Image, Product} from '../types';

import CollectionTypeSection from './components/CollectionTypeSection';
import ProductAddSection from './components/ProductAddSection';
import ProductSection from './components/ProductSection';
import TitleSection from './components/TitleSection';

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
    console.log('data changed', data);
  }, [data]);

  useEffect(() => {
    setData({
      ...data,
      products: collection.products,
    });
  }, [collection.products]);

  const onAddProductsToCollection = (productIDs: number[]) => {
    const url = route('lshopify.collections.products.store', [collection.id]);
    Inertia.post(
      url,
      {
        products: productIDs,
      },
      {
        preserveState: false,
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

  const onSearch = (searchTerm: string) => {
    Inertia.get(
      route('lshopify.collections.edit', [collection.id]),
      {
        searchTerm,
      },
      {
        preserveState: true,
        replace: true,
      },
    );
    setData({
      ...data,
      searchTerm,
    });
  };

  const onImageSubmit = (img: Image) => {
    uploadImages([img], collection.id, 'collection', {
      onSuccess: () => {
        Inertia.reload();
      },
      preserveState: false,
    });
  };

  const onImageRemove = () => {
    if (collection.image) {
      deleteImages([collection.image], {
        onSuccess: () => {
          Inertia.reload();
        },
        preserveState: false,
      });
    }
  };

  return (
    <Main>
      <div className="p-6">
        <FormSubmitBar onSubmit={handleSubmit} show={isDirty} />

        <div className="flex flex-row items-center space-x-2">
          <BackButton
            onClick={() => {
              Inertia.get(route('lshopify.collections.index'));
            }}
          />
          <PageHeader text={collection.name} />
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 space-y-6 lg:col-span-2 lg:col-start-1">
            <TitleSection
              name={data.name}
              description={data.description || ''}
              onChange={(field, value) => setData(field, value)}
            />
            {data.type === 'manual' ? (
              <ProductAddSection
                searchTerm={data.searchTerm}
                sortTerm={data.sortTerm}
                products={products}
                collectionProducts={data.products || []}
                onChange={(field, value) => setData(field, value)}
                onAddProducts={onAddProductsToCollection}
                onSearch={onSearch}
              />
            ) : (
              <>
                <Card>
                  <CollectionTypeSection
                    collection={data}
                    onChange={(field, value) => setData(field, value)}
                  />
                </Card>

                <ProductSection
                  sortTerm={data.sortTerm}
                  collectionProducts={data.products || []}
                />
              </>
            )}
          </section>
          <section className="space-y-6 lg:col-span-1 lg:col-start-3">
            <ImageSelect
              data={data}
              onImageRemove={() => onImageRemove()}
              onConfirm={img => onImageSubmit(img)}
            />
          </section>
        </div>
      </div>
    </Main>
  );
}
