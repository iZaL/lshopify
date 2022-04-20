import {Inertia} from '@inertiajs/inertia';
import React from 'react';
import route from 'ziggy-js';

import PageHeader from '../components/PageHeader';
import Main from '../Main';
import {Order} from '../types';

import OrderList from './components/OrderList';
import DraftOrderIndexActionButtons from './Draft/components/DraftOrderIndexActionButtons';

interface Props {
  orders: Order[];
}

export default function OrderIndex(props: Props) {
  const {orders} = props;

  const onOrderClick = (order: Order) => {
    Inertia.get(route('lshopify.orders.show', [order.id]));
  };

  return (
    <Main>
      <div className="p-6">
        <div className="mx-auto max-w-7xl xl:flex xl:items-center xl:justify-between">
          <PageHeader text="Orders" />
          <DraftOrderIndexActionButtons />
        </div>

        <div className="mx-auto max-w-7xl py-6 ">
          <section className="rounded-lg bg-white shadow">
            <OrderList orders={orders} onItemClick={onOrderClick} />
          </section>
        </div>
      </div>
    </Main>
  );
}
