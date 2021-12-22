import React, {useEffect} from 'react';
import Main from '../Main';
import {navigationActiveState} from '../atoms';
import {useSetRecoilState} from 'recoil';
import PageHeader from '../components/PageHeader';
import {Product} from '../types';
import ProductIndexActionButtons from './components/ProductIndexActionButtons';
import ProductSearchBar from './components/ProductSearchBar';
import Products from './components/Products';

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
  const setNavigation = useSetRecoilState(navigationActiveState);

  const {products} = props;

  useEffect(() => {
    setNavigation('Products');
  }, []);

  return (
    <Main>
      <div className='p-6'>
        <div className='max-w-7xl mx-auto xl:flex xl:items-center xl:justify-between'>
          <PageHeader text={'Productss'} />
          <ProductIndexActionButtons />
        </div>

        <div className='max-w-7xl mx-auto py-6 '>
          <section className='rounded-lg overflow-hidden shadow bg-white'>
            <ProductSearchBar tabs={tabs} />
            <Products products={products} />
          </section>
        </div>
      </div>
    </Main>
  );
}
