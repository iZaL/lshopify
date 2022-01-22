import React, {useState} from 'react';
import Main from '../Main';
import PageHeader from '../components/PageHeader';
import {Product} from '../types';
import ProductIndexActionButtons from './components/ProductIndexActionButtons';
import ProductSearchBar from './components/ProductSearchBar';
import Products from './components/Products';
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
        <div className="max-w-7xl mx-auto xl:flex xl:items-center xl:justify-between">
          <PageHeader text={'Products'} />
          <ProductIndexActionButtons />
        </div>

        <div className="max-w-7xl mx-auto py-6 ">
          <section className="rounded-lg overflow-hidden shadow bg-white">
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
            <Products products={products} />
          </section>
        </div>
      </div>
    </Main>
  );
}
