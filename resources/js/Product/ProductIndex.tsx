import React, {useState} from 'react';
import Main from '../Main';
import PageHeader from '../components/PageHeader';
import { Product, ProductStatus } from '../types'
import ProductIndexActionButtons from './components/ProductIndexActionButtons';
import ProductSearchBar from './components/ProductSearchBar';
import ProductsList from './components/ProductsList';
import RightSidebar from '../components/RightSidebar';
import ProductFiltersPanel from './components/ProductFiltersPanel';
import { Inertia } from '@inertiajs/inertia';
import route from 'ziggy-js';
import { useForm } from '@inertiajs/inertia-react'

interface Props {
  products: Product[];
  statuses:ProductStatus[];
  search:string;
  status:ProductStatus;
}

export default function ProductIndex(props: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {products} = props;

  const {data,setData} = useForm({
    search: props.search,
    status: props.status
  });

  const onSearch = (term: string) => {
    const newData = {
      ...data,
      search: term
    }
    Inertia.get(route('lshopify.products.index'), newData, {preserveState: true, replace: false});
    setData(newData);
  };

  const onStatusChange = (status:ProductStatus) => {
    const newData = {
      ...data,
      status: status
    }
    Inertia.get(route('lshopify.products.index'), newData, {preserveState: true, replace: true});
    setData(newData);
  };

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
              onMoreFiltersClick={() => setSidebarOpen(!sidebarOpen)}
              onSearch={onSearch}
              searchTerm={data.search}
              tabs={props.statuses || []}
              onStatusChange={onStatusChange}
              status={data.status}
            />
            <ProductsList products={products}
            />
          </section>
        </div>
      </div>
    </Main>
  );
}
