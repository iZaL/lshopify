import {Inertia} from '@inertiajs/inertia';
import React, {useState} from 'react';
import route from 'ziggy-js';
import PageHeader from '../../components/PageHeader';
import Main from '../../Main';
import {Order} from '../../types';
import DraftOrderIndexActionButtons from './components/DraftOrderIndexActionButtons';
import DraftOrderList from './components/DraftOrderList';
import DraftOrdersSearchBar from './components/DraftOrdersSearchBar';

interface Props {
  orders: Order[];
  cartTotal: string;
}

export default function DraftOrderIndex(props: Props) {
  const {orders, cartTotal} = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const onOrderClick = (order: Order) => {
    Inertia.get(route('lshopify.draft.orders.edit', [order.id]));
  };

  return (
    <Main>
      <div className="p-6">
        <div className="mx-auto max-w-7xl xl:flex xl:items-center xl:justify-between">
          <PageHeader text={`Draft orders`} />
          <DraftOrderIndexActionButtons />
        </div>

        <div className="mx-auto max-w-7xl py-6 ">
          <section className="rounded-lg bg-white shadow">
            {/*<RightSidebar*/}
            {/*  isOpen={sidebarOpen}*/}
            {/*  onClose={() => setSidebarOpen(false)}*/}
            {/*  title={'More Filters'}>*/}
            {/*  <DraftOrdersFiltersPanel />*/}
            {/*</RightSidebar>*/}
            <DraftOrdersSearchBar
              tabs={[]}
              onMoreFiltersClick={() => setSidebarOpen(!sidebarOpen)}
            />
            <DraftOrderList orders={orders} onItemClick={onOrderClick} />
          </section>
        </div>
      </div>
    </Main>
  );
}
