import React, {useEffect, useState} from 'react';
import Main from '../../Main';
import {navigationActiveState} from '../../atoms';
import {useSetRecoilState} from 'recoil';
import PageHeader from '../../components/PageHeader';
import FormSubmitBar from '../../components/FormSubmitBar';
import {useForm} from '@inertiajs/inertia-react';
import {Inertia} from '@inertiajs/inertia';
import DraftOrderDetailsSection from './components/DraftOrderDetailsSection';
import {Product, Cart, CartItem, CartDiscount} from '../../types';
import route from 'ziggy-js';

interface Props {
  products: Product[];
  cart: Cart;
}

export default function DraftOrderCreate(props: Props) {
  const setNavigation = useSetRecoilState(navigationActiveState);

  const {products, cart} = props;

  const [searchTerm, setSearchTerm] = useState('');

  const {data} = useForm<Cart>({
    ...cart,
  });

  useEffect(() => {
    setNavigation('Orders');
  }, []);

  useEffect(() => {
    console.log('data changed', data);
  }, [data]);

  const onVariantsAdd = (variantIDs: number[]) => {
    Inertia.post(route('lshopify.cart.add'), {
      variantIDs: variantIDs,
    });
  };

  const onVariantRemove = (rowId: string) => {
    Inertia.post(route('lshopify.cart.remove'), {
      rowId: rowId,
    });
  };

  const onVariantEdit = (rowId: string, item: CartItem) => {
    Inertia.post(route('lshopify.cart.update'), {
      rowId: rowId,
      item: item,
    });
  };

  const onApplyDiscount = (discount: CartDiscount, item?: CartItem) => {
    Inertia.post(route('lshopify.cart.discount.add'), {
      discount: discount,
      item: item,
    });
  };

  const onRemoveDiscount = (discount: CartDiscount, item?: CartItem) => {
    Inertia.post(route('lshopify.cart.discount.remove'), {
      discount: discount,
      item: item,
    });
  };

  const onCreateOrder = () => {};

  const handleSubmit = () => {
    Inertia.post(route('lshopify.orders.draft.store'), data, {
      onSuccess: () => {
        console.log('success');
      },
    });
  };

  return (
    <Main>
      <div className="p-6">
        <FormSubmitBar onSubmit={handleSubmit} />

        <PageHeader text={'Create Order'} />

        <div className="mt-6 max-w-3xl mx-auto grid grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="lg:col-start-1 lg:col-span-2 space-y-6">
            <DraftOrderDetailsSection
              searchTerm={searchTerm}
              setSearchTerm={text => setSearchTerm(text)}
              products={products || []}
              cart={cart}
              onVariantsAdd={onVariantsAdd}
              onVariantRemove={onVariantRemove}
              onVariantEdit={onVariantEdit}
              onApplyDiscount={onApplyDiscount}
              onRemoveDiscount={onRemoveDiscount}
              onCreateOrder={onCreateOrder}
            />
          </section>
          {/*<section className='lg:col-start-3 lg:col-span-1 space-y-6'>*/}
          {/*	<CustomerSelect />*/}
          {/*</section>*/}
        </div>
      </div>
    </Main>
  );
}
