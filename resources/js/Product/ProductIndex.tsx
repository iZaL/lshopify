import React, {useState} from 'react';
import Main from '../Main';
import PageHeader from '../components/PageHeader';
import {Product, ProductStatus} from '../types';
import ProductIndexActionButtons from './components/ProductIndexActionButtons';
import ProductSearchBar from './components/ProductSearchBar';
import ProductsList from './components/ProductsList';
import RightSidebar from '../components/RightSidebar';
import ProductFiltersPanel from './components/ProductFiltersPanel';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';

interface Props {
  products: Product[];
  statuses: ProductStatus[];
  status: ProductStatus;
  search: string;
}

export default function ProductIndex(props: Props) {
  const {products} = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productAttributes, setProductAttributes] = useState({
    status: props.status,
    search: props.search,
  });

  const onChange = (field: 'search' | 'status', value: string) => {
    const newData = {
      ...productAttributes,
      [field]: value,
    };
    Inertia.get(route('lshopify.products.index'), newData, {
      preserveState: true,
      replace: true,
    });
    setProductAttributes(newData);
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
              <ProductFiltersPanel />
            </RightSidebar>
            <ProductSearchBar
              onMoreFiltersClick={() => setSidebarOpen(!sidebarOpen)}
              searchTerm={productAttributes.search}
              status={productAttributes.status}
              tabs={props.statuses || []}
              onChange={onChange}
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
