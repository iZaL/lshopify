import React from 'react';
import Main from '../Main';
import PageHeader from './../components/PageHeader';
import {Order} from '../types';
import DraftOrderIndexActionButtons from './Draft/components/DraftOrderIndexActionButtons';

interface Props {
  order: Order;
}

export default function OrderEdit(props: Props) {
  const {order} = props;

  return (
    <Main>
      <div className="p-6">
        <div className="mx-auto max-w-7xl xl:flex xl:items-center xl:justify-between">
          <PageHeader text={`Order ${order.id}`} />
          <DraftOrderIndexActionButtons />
        </div>

        <div className="mx-auto max-w-7xl py-6 ">
          <section className="overflow-hidden rounded-lg bg-white shadow"></section>
        </div>
      </div>
    </Main>
  );
}
