import React from 'react';
import Main from '../../Main';
import PageHeader from '../../components/PageHeader';
import {Order} from '../../types';
import DraftOrderIndexActionButtons from './components/DraftOrderIndexActionButtons';
import DraftOrderList from './components/DraftOrderList';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';

interface Props {
  orders: Order[];
  cartTotal: string;
}

export default function DraftOrderIndex(props: Props) {
  const {orders, cartTotal} = props;

  const onOrderClick = (order: Order) => {
    Inertia.get(route('lshopify.orders.draft.edit', [order.id]));
  };

  return (
    <Main>
      <div className="p-6">
        <div className="max-w-7xl mx-auto xl:flex xl:items-center xl:justify-between">
          <PageHeader text={`Orders ${cartTotal}`} />
          <DraftOrderIndexActionButtons />
        </div>

        <div className="max-w-7xl mx-auto py-6 ">
          <section className="rounded-lg overflow-hidden shadow">
            <DraftOrderList orders={orders} onItemClick={onOrderClick} />
          </section>
        </div>
      </div>
    </Main>
  );
}
