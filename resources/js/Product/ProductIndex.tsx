import React, { useState } from 'react'
import Main from '../Main'
import PageHeader from '../components/PageHeader'
import { Category, Product, Vendor } from '../types'
import ProductIndexActionButtons from './components/ProductIndexActionButtons'
import ProductSearchBar from './components/ProductSearchBar'
import ProductsList from './components/ProductsList'
import { Inertia } from '@inertiajs/inertia'
import route from 'ziggy-js'
import { SearchAttributes, TabAttributes } from './types'

interface Props {
  products: Product[];
  vendors: Vendor[];
  categories: Category[];
  search_attributes: SearchAttributes;
}

const tabs: TabAttributes[] = ['all', 'active', 'draft', 'archived'];

export default function ProductIndex(props: Props) {
  const {products, search_attributes, vendors, categories} = props;
  const [searchAttributes, setSearchAttributes] = useState(search_attributes);

  const onChange = (data: SearchAttributes) => {
    setSearchAttributes(data);
    Inertia.get(route('lshopify.products.index'), data, {
      preserveState: true,
    });
  };

  const onBulkUpdate = <T extends keyof Product>(
    productIDs: Product['id'][],
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

  const onDelete = (productIDs: Product['id'][]) => {
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
          <section className="rounded-lg bg-white shadow">
            <ProductSearchBar
              vendors={vendors || []}
              categories={categories || []}
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
