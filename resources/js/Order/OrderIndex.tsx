import React from 'react';
import Main from '../Main';
import PageHeader from './../components/PageHeader';
import {Order} from '../types';
import DraftOrderIndexActionButtons from './Draft/components/DraftOrderIndexActionButtons';
import DraftOrderList from './Draft/components/DraftOrderList';
import {Inertia} from '@inertiajs/inertia';
import route from 'ziggy-js';

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
        <div className="max-w-7xl mx-auto xl:flex xl:items-center xl:justify-between">
          <PageHeader text={`Orders`} />
          <DraftOrderIndexActionButtons />
        </div>

        <div className="max-w-7xl mx-auto py-6 ">
          <section className="dark:bg-gray-900 rounded-lg overflow-hidden shadow bg-white">
            <DraftOrderList orders={orders} onItemClick={onOrderClick} />
          </section>
        </div>
      </div>
    </Main>
  );
}
