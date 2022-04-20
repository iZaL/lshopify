import {Inertia} from '@inertiajs/inertia';
import React, {useState} from 'react';
import route from 'ziggy-js';

import PageHeader from '../components/PageHeader';
import Main from '../Main';
import {Category, Collection, Product, Vendor} from '../types';

import ProductIndexActionButtons from './components/ProductIndexActionButtons';
import ProductSearchBar from './components/ProductSearchBar';
import ProductsList from './components/ProductsList';
import {SearchAttributes, TabAttributes} from './types';

interface Props {
  products: {
    data: Product[];
  };
  vendors: Vendor[];
  categories: Category[];
  collections: {
    data: Collection[];
  };
  search_attributes: SearchAttributes;
}

const tabs: TabAttributes[] = ['all', 'active', 'draft', 'archived'];

export default function ProductIndex(props: Props) {
  const {products, search_attributes, vendors, categories, collections} = props;
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
    const updatedProducts = products.data.map(product => {
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
          <PageHeader text="Products" />
          <ProductIndexActionButtons />
        </div>

        <div className="mx-auto max-w-7xl py-6">
          <section className="rounded-lg bg-white shadow">
            <ProductSearchBar
              vendors={vendors || []}
              categories={categories || []}
              collections={collections.data || []}
              tabs={tabs}
              onChange={onChange}
              searchAttributes={searchAttributes}
            />
            <ProductsList
              products={products.data || []}
              onUpdate={onBulkUpdate}
              onDelete={onDelete}
            />
          </section>
        </div>
      </div>
    </Main>
  );
}
