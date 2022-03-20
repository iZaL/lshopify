import React, { useEffect, useState } from 'react'
import Main from '../Main'
import PageHeader from '../components/PageHeader'
import { Product, Vendor } from '../types'
import ProductIndexActionButtons from './components/ProductIndexActionButtons'
import ProductSearchBar from './components/ProductSearchBar'
import ProductsList from './components/ProductsList'
import RightSidebar from '../components/RightSidebar'
import ProductFiltersPanel from './components/ProductFiltersPanel'
import { Inertia } from '@inertiajs/inertia'
import route from 'ziggy-js'
import { SearchAttributes, TabAttributes } from './types'

interface Props {
  products: Product[];
  vendors: Vendor[];
  search_attributes:SearchAttributes;
}

const tabs: TabAttributes[] = ['all', 'active', 'draft', 'archived'];

export default function ProductIndex(props: Props) {
  const {
    products,
    search_attributes,
    vendors,
  } = props;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchAttributes, setSearchAttributes] = useState(search_attributes);

  const onChange = (data: SearchAttributes) => {
    setSearchAttributes(data);
    Inertia.get(route('lshopify.products.index'), data, {
      preserveState: true,
      replace: true,
    });
  };

  const onBulkUpdate = <T extends keyof Product>(
    productIDs: number[],
    field: T,
    value: Product[T],
  ) => {
    const updatedProducts = products.map(product => {
      if (productIDs.includes(product.id)) {
        return {
          ...product,
          [field]: value,
        };
      }
      return product;
    });
    Inertia.post(route('lshopify.products.bulk_editor.update'), {
      products: updatedProducts,
    });
  };

  const onDelete = (productIDs: number[]) => {
    Inertia.post(route('lshopify.products.delete'), {
      product_ids: productIDs,
    });
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
              <ProductFiltersPanel
              />
            </RightSidebar>
            <ProductSearchBar
              onMoreFiltersClick={() => setSidebarOpen(!sidebarOpen)}
              vendors={vendors || []}
              tabs={tabs}
              onChange={onChange}
              searchAttributes={searchAttributes}
            />
            <ProductsList
              products={products}
              onUpdate={onBulkUpdate}
              onDelete={onDelete}
            />
          </section>
        </div>
      </div>
    </Main>
  );
}
