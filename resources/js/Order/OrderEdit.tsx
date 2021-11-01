import React, {useEffect} from 'react';
import Main from '../Main';
import {navigationActiveState} from '../atoms';
import {useSetRecoilState} from 'recoil';
import PageHeader from './../components/PageHeader';
import {Order} from '../types';
import DraftOrderIndexActionButtons from './Draft/components/DraftOrderIndexActionButtons';

interface Props {
  order: Order;
}

export default function OrderEdit(props: Props) {
  const setNavigation = useSetRecoilState(navigationActiveState);

  const {order} = props;
  console.log('props', props);

  useEffect(() => {
    setNavigation('Orders');
  }, []);

  return (
    <Main>
      <div className='p-6'>
        <div className='max-w-7xl mx-auto xl:flex xl:items-center xl:justify-between'>
          <PageHeader text={`Order ${order.id}`} />
          <DraftOrderIndexActionButtons />
        </div>

        <div className='max-w-7xl mx-auto py-6 '>
          <section className='rounded-lg bg-white overflow-hidden shadow'></section>
        </div>
      </div>
    </Main>
  );
}
