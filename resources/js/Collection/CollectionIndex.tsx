import React, {useState} from 'react';
import Main from '../Main';
import PageHeader from '../components/PageHeader';
import {Collection} from '../types';
import CollectionIndexActionButtons from './components/CollectionIndexActionButtons';
import CollectionList from './components/CollectionList';
import RightSidebar from '../components/RightSidebar';
import CollectionSearchBar from './components/CollectionSearchBar';

interface Props {
  collections: Collection[];
}

interface TabProps {
  name: string;
  href: string;
  current: boolean;
}

const tabs: TabProps[] = [{name: 'All', href: '#', current: true}];

export default function CollectionIndex(props: Props) {
  const {collections} = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Main>
      <div className="p-6">
        <div className="mx-auto max-w-7xl xl:flex xl:items-center xl:justify-between">
          <PageHeader text={'Collections'} />
          <CollectionIndexActionButtons />
        </div>

        <div className="mx-auto max-w-7xl py-6 ">
          <section className="overflow-hidden rounded-lg bg-white shadow">
            <RightSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              title={'More Filters'}>
              {/*<ProductFiltersPanel />*/}
            </RightSidebar>
            <CollectionSearchBar
              tabs={tabs}
              onMoreFiltersClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <CollectionList collections={collections} />
          </section>
        </div>
      </div>
    </Main>
  );
}
