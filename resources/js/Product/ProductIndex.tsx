import React, {useState} from 'react';
import Main from '../Main';
import PageHeader from '../components/PageHeader';
import {Product} from '../types';
import ProductIndexActionButtons from './components/ProductIndexActionButtons';
import ProductSearchBar from './components/ProductSearchBar';
import ProductsList from './components/ProductsList';
import RightSidebar from '../components/RightSidebar';
import ProductFiltersPanel from './components/ProductFiltersPanel';

interface TabProps {
  name: string;
  href: string;
  current: boolean;
}

const tabs: TabProps[] = [
  {name: 'All', href: '#', current: true},
  {name: 'Active', href: '#', current: false},
  {name: 'Draft', href: '#', current: false},
  {name: 'Archived', href: '#', current: false},
];

interface Props {
  products: Product[];
}

export default function ProductIndex(props: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {products} = props;

  return (
    <Main>
      <div className="p-6">
        <div className="mx-auto max-w-7xl xl:flex xl:items-center xl:justify-between">
          <PageHeader text={'Products'} />
          <ProductIndexActionButtons />
        </div>

        <div className="mx-auto max-w-7xl py-6 ">
          <section className="overflow-hidden rounded-lg bg-white shadow">
            <RightSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              title={'More Filters'}>
              <ProductFiltersPanel />
            </RightSidebar>
            <ProductSearchBar
              tabs={tabs}
              onMoreFiltersClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <ProductsList products={products} />
          </section>
        </div>
      </div>
    </Main>
  );
}
