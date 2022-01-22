import React, {useEffect} from 'react';
import Main from '../Main';
import {navigationActiveState} from '../atoms';
import {useSetRecoilState} from 'recoil';
import PageHeader from '../components/PageHeader';
import TitleSection from './components/TitleSection';
import FormSubmitBar from '../components/FormSubmitBar';
import {useForm} from '@inertiajs/inertia-react';
import {Collection} from '../types';
import CollectionTypeSection from './components/CollectionTypeSection';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';

export default function CollectionCreate() {
  const setNavigation = useSetRecoilState(navigationActiveState);

  const collection: Collection = {
    id: 0,
    name: 'Summer collection',
    description: '',
    type: 'manual',
    determiner: 'all',
    conditions: [],
  };

  const {data, setData} = useForm({
    ...collection,
  });

  useEffect(() => {
    setNavigation('Products');
  }, []);

  useEffect(() => {
    console.log('data changed', data);
  }, [data]);

  const handleSubmit = () => {
    const url = route('lshopify.collections.store');
    // @ts-ignore
    Inertia.post(url, data, {
      onSuccess: () => {
        Inertia.reload();
      },
    });
  };

  return (
    <Main>
      <div className="p-6">
        <FormSubmitBar onSubmit={handleSubmit} />

        <PageHeader text={'Create collection'} />

        <div className="mt-6 max-w-3xl mx-auto grid grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 lg:col-start-1 lg:col-span-2 space-y-6">
            <TitleSection
              name={data.name}
              description={data.description || ''}
              onChange={(field, value) => setData(field, value)}
            />
            <CollectionTypeSection
              collection={data}
              onChange={(field, value) => setData(field, value)}
            />
          </section>
        </div>
      </div>
    </Main>
  );
}
