import React from 'react';
import Main from '../Main';
import PageHeader from '../components/PageHeader';
import {Collection} from '../types';
import CollectionIndexActionButtons from './components/CollectionIndexActionButtons';
import CollectionList from './components/CollectionList';

interface Props {
  collections: Collection[];
}

export default function CollectionIndex(props: Props) {
  const {collections} = props;

  return (
    <Main>
      <div className="p-6">
        <div className="max-w-7xl mx-auto xl:flex xl:items-center xl:justify-between">
          <PageHeader text={'Collections'} />
          <CollectionIndexActionButtons />
        </div>

        <div className="max-w-7xl mx-auto py-6 ">
          <section className="rounded-lg bg-white overflow-hidden shadow">
            <CollectionList collections={collections} />
          </section>
        </div>
      </div>
    </Main>
  );
}
