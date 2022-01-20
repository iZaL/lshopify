import React, {useEffect} from 'react';
import Main from '../Main';
import {navigationActiveState} from '../atoms';
import {useSetRecoilState} from 'recoil';
import PageHeader from '../components/PageHeader';
import {Collection, Product} from '../types';
import CollectionIndexActionButtons from './components/CollectionIndexActionButtons';
import CollectionList from './components/CollectionList';

interface Props {
  collections: Collection[];
}

export default function CollectionIndex(props: Props) {
  const setNavigation = useSetRecoilState(navigationActiveState);

  const {collections} = props;

  useEffect(() => {
    setNavigation('Products');
  }, []);

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
