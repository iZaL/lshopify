import {Inertia} from '@inertiajs/inertia';
import {useForm} from '@inertiajs/inertia-react';
import React, {useEffect, useState} from 'react';
import route from 'ziggy-js';
import FormSubmitBar from '../../components/FormSubmitBar';
import PageHeader from '../../components/PageHeader';
import Main from '../../Main';
import {Cart, CartDiscount, CartItem, Product} from '../../types';
import DraftOrderDetailsSection from './components/DraftOrderDetailsSection';

interface Props {
  products: Product[];
  cart: Cart;
}

export default function DraftOrderCreate(props: Props) {
  const {products, cart} = props;

  const [searchTerm, setSearchTerm] = useState('');

  const {data} = useForm<Cart>({
    ...cart,
  });

  useEffect(() => {
    console.log('data changed', data);
  }, [data]);

  const onVariantsAdd = (variantIDs: number[]) => {
    Inertia.post(route('lshopify.cart.add'), {
      variantIDs,
    });
  };

  const onVariantRemove = (rowId: string) => {
    Inertia.post(route('lshopify.cart.remove'), {
      rowId,
    });
  };

  const onVariantEdit = (rowId: string, item: CartItem) => {
    Inertia.post(route('lshopify.cart.update'), {
      rowId,
      item,
    });
  };

  const onApplyDiscount = (discount: CartDiscount, item?: CartItem) => {
    Inertia.post(route('lshopify.cart.discount.add'), {
      discount,
      item,
    });
  };

  const onRemoveDiscount = (discount: CartDiscount, item?: CartItem) => {
    Inertia.post(route('lshopify.cart.discount.remove'), {
      discount,
      item,
    });
  };

  const onCreateOrder = () => {};

  const handleSubmit = () => {
    Inertia.post(route('lshopify.draft.orders.store'), data);
  };

  return (
    <Main>
      <div className="p-6">
        <FormSubmitBar onSubmit={handleSubmit} />

        <PageHeader text="Create Order" />

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2 lg:col-start-1">
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
        </div>
      </div>
    </Main>
  );
}
