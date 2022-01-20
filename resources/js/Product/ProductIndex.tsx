import React, { useEffect, useState } from 'react'
import Main from '../Main'
import { navigationActiveState } from '../atoms'
import { useSetRecoilState } from 'recoil'
import PageHeader from '../components/PageHeader'
import { Product } from '../types'
import ProductIndexActionButtons from './components/ProductIndexActionButtons'
import ProductSearchBar from './components/ProductSearchBar'
import Products from './components/Products'
import RightSidebar from '../components/RightSidebar'
import ProductFiltersPanel from './components/ProductFiltersPanel'

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


  const [sidebarOpen, setSidebarOpen] = useState(false);


  const {products} = props;

  useEffect(() => {
    setNavigation('Products');
  }, []);


  // <Disclosure as="div" key={section.id} className="border-t border-gray-200 px-4 py-6">
  //   {({ open }) => (
  //     <>
  //       <h3 className="-mx-2 -my-3 flow-root">
  //         <Disclosure.Button className="px-2 py-3 bg-white w-full flex items-center justify-between text-gray-400 hover:text-gray-500">
  //           <span className="font-medium text-gray-900">{section.name}</span>
  //           <span className="ml-6 flex items-center">
  //                               {open ? (
  //                                 <MinusSmIcon className="h-5 w-5" aria-hidden="true" />
  //                               ) : (
  //                                 <PlusSmIcon className="h-5 w-5" aria-hidden="true" />
  //                               )}
  //                             </span>
  //         </Disclosure.Button>
  //       </h3>
  //       <Disclosure.Panel className="pt-6">
  //         <div className="space-y-6">
  //           {section.options.map((option, optionIdx) => (
  //             <div key={option.value} className="flex items-center">
  //               <input
  //                 id={`filter-mobile-${section.id}-${optionIdx}`}
  //                 name={`${section.id}[]`}
  //                 defaultValue={option.value}
  //                 type="checkbox"
  //                 defaultChecked={option.checked}
  //                 className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
  //               />
  //               <label
  //                 htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
  //                 className="ml-3 min-w-0 flex-1 text-gray-500"
  //               >
  //                 {option.label}
  //               </label>
  //             </div>
  //           ))}
  //         </div>
  //       </Disclosure.Panel>


  return (
    <Main>
      <div className="p-6">
        <div className="max-w-7xl mx-auto xl:flex xl:items-center xl:justify-between">
          <PageHeader text={'Products'} />
          <ProductIndexActionButtons />
        </div>

        <div className="max-w-7xl mx-auto py-6 ">
          <section className="rounded-lg overflow-hidden shadow bg-white">
            <RightSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} title={'More Filters'}>
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
