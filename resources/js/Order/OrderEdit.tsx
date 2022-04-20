import {Inertia} from '@inertiajs/inertia';
import React from 'react';
import route from 'ziggy-js';

import BackButton from '../components/BackButton';
import PageHeader from '../components/PageHeader';
import Main from '../Main';
import {Order} from '../types';

interface Props {
  order: Order;
}

export default function OrderEdit(props: Props) {
  const {order} = props;

  return (
    <Main>
      <div className="p-6">
        <div className="flex flex-row items-center space-x-2">
          <BackButton
            onClick={() => {
              Inertia.get(route('lshopify.products.index'));
            }}
          />
          <PageHeader text={`Order ${order.id}`} />
        </div>

        {/* <div className="mx-auto max-w-7xl xl:flex xl:items-center xl:justify-between"> */}
        {/*  <PageHeader text={`Order ${order.id}`} /> */}
        {/*  <DraftOrderIndexActionButtons /> */}
        {/* </div> */}

        <div className="mx-auto max-w-7xl py-6">
          <section className="overflow-hidden rounded-lg bg-white shadow" />
        </div>
      </div>
    </Main>
  );
}
