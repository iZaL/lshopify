import React from 'react';
import Main from '../Main';
import PageHeader from '../components/PageHeader';
import TitleSection from './components/TitleSection';
import FormSubmitBar from '../components/FormSubmitBar';
import {useForm} from '@inertiajs/inertia-react';
import {Collection} from '../types';
import CollectionTypeSection from './components/CollectionTypeSection';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';
import Subheader from '../components/Subheader';
import Card from '../components/Card';
import Border from '../components/Border';

export default function CollectionCreate() {
  const collection: Collection = {
    id: 0,
    name: 'Summer collection',
    description: '',
    type: 'manual',
    determiner: 'all',
    conditions: [],
  };

  const {data, setData, isDirty} = useForm({
    ...collection,
  });

  const handleSubmit = () => {
    const url = route('lshopify.collections.store');
    Inertia.post(url, data, {
      onSuccess: () => {
        Inertia.reload();
      },
    });
  };

  return (
    <Main>
      <div className="p-6">
        <FormSubmitBar onSubmit={handleSubmit} show={isDirty} />

        <PageHeader text={'Create collection'} />

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 space-y-6 lg:col-span-2 lg:col-start-1">
            <TitleSection
              name={data.name}
              description={data.description || ''}
              onChange={(field, value) => setData(field, value)}
            />

            <Card>
              <Subheader text="Collection type" />

              <div className="space-y-2 text-sm">
                <div>
                  <div className="flex flex-row items-center">
                    <input
                      type="radio"
                      value="manual"
                      name="type"
                      className="h-3 w-3"
                      checked={data.type === 'manual'}
                      onChange={() => setData('type', 'manual')}
                    />
                    <div className="ml-3">Manual</div>
                  </div>
                  <p className="ml-6 text-sm text-gray-500">
                    Add products to this collection one by one. Learn more about
                  </p>
                </div>

                <div>
                  <div className="flex flex-row items-center">
                    <input
                      type="radio"
                      value="smart"
                      name="type"
                      className="h-3 w-3"
                      checked={data.type === 'smart'}
                      onChange={() => setData('type', 'smart')}
                    />
                    <div className="ml-3">Automated</div>
                  </div>
                  <p className="ml-6 text-sm text-gray-500">
                    Existing and future products that match the conditions you set will
                    automatically be added to this collection. Learn more about automated
                    collections.
                  </p>
                </div>
              </div>

              {data.type === 'smart' && (
                <>
                  <Border />

                  <CollectionTypeSection
                    collection={data}
                    onChange={(field, value) => setData(field, value)}
                  />
                </>
              )}
            </Card>
          </section>
        </div>
      </div>
    </Main>
  );
}
