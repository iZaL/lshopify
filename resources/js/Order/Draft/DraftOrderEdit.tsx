import React, {useEffect, useState} from 'react';
import Main from '../../Main';
import {navigationActiveState} from '../../atoms';
import {useSetRecoilState} from 'recoil';
import PageHeader from '../../components/PageHeader';
import FormSubmitBar from '../../components/FormSubmitBar';
import {Inertia} from '@inertiajs/inertia';
import {useForm} from '@inertiajs/inertia-react';
import {
  Cart,
  Order,
  Product,
  Customer,
  Billing,
  Shipping,
} from '../../types';
import DraftOrderDetailsSection from './components/DraftOrderDetailsSection';
import CustomerSelect from './components/CustomerSelect';
import CustomerEdit from './components/CustomerEdit';
import route from 'ziggy-js';

interface Props {
  products: Product[];
  cart: Cart;
  order: Order;
  customers: Customer[];
}

export default function DraftOrderEdit(props: Props) {
  const setNavigation = useSetRecoilState(navigationActiveState);

  const {products, cart, order, customers} = props;

  const [searchTerm, setSearchTerm] = useState('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');

  const {data, setData} = useForm<Order & {_method: 'PATCH'}>({
    ...order,
    _method: 'PATCH',
  });

  useEffect(() => {
    setNavigation('Orders');
  }, []);

  useEffect(() => {
    console.log('data changed', data);
  }, [data]);

  useEffect(() => {
    setData({
      ...data,
      ...order,
    });
  }, [props.order]);

  const onCartItemAdd = (variantIDs: number[]) => {
    Inertia.post(route('lshopify.cart.add'), {
      variantIDs: variantIDs,
      orderID: order.id,
    });
  };

  const onCartItemRemove = (rowId: string) => {
    Inertia.post(route('lshopify.cart.remove'), {
      rowId: rowId,
      orderID: order.id,
    });
  };

  const onCartItemEdit = (rowId: string, item: any) => {
  // const onCartItemEdit = (rowId: string, item: CartItem) => {
    // @ts-ignore
    Inertia.post(route('lshopify.cart.update'), {
      rowId: rowId,
      item: item,
      orderID: order.id,
    });
  };

  const onApplyDiscount = (discount: any, item?: any) => {
  // const onApplyDiscount = (discount: CartDiscount, item?: CartItem) => {
    Inertia.post(route('lshopify.cart.discount.add'), {
      discount: discount,
      item: item,
    });
  };

  const onRemoveDiscount = (discount: any, item?: any) => {
  // const onRemoveDiscount = (discount: CartDiscount, item?: CartItem) => {
    Inertia.post(route('lshopify.cart.discount.remove'), {
      discount: discount,
      item: item,
    });
  };

  const onCustomerCreate = (
    customerData: any,
    addressData: any,
    // customerData: CustomerForm,
    // addressData: CustomerAddress,
  ) => {
    Inertia.post(
      route('lshopify.customers.store'),
      {
        customer: customerData,
        address: addressData,
      },
      {
        onSuccess: () => {
          console.log('success');
        },
      },
    );
  };

  const onAttachCustomer = (customer?: Customer) => {
    Inertia.post(
      route('lshopify.orders.draft.customer.update', [order.id]),
      // `/draft_orders/${order.id}/customer`,
      {
        customer_id: customer ? customer.id : null,
      },
      {
        onSuccess: () => {
          console.log('success');
        },
      },
    );
  };

  const onCustomerAddressSave = (
    type: 'shipping' | 'billing',
    address: Shipping | Billing,
  ) => {
    handleSubmit({
      [type]: {
        ...address,
      },
    });
  };

  const onCreateOrder = () => {
    Inertia.post(route('lshopify.orders.draft.confirm', [order.id]));
  };

  const handleSubmit = (extraData?: {[x: string]: any}) => {
    let postData = data;
    if (extraData) {
      postData = {
        ...data,
        ...extraData,
      };
    }
    // @ts-ignore
    Inertia.post(route('lshopify.orders.draft.update', [order.id]), postData, {
      onSuccess: () => {
        console.log('success');
      },
    });
  };

  return (
    <Main>
      <div className="p-6">
        <FormSubmitBar onSubmit={handleSubmit} />

        <PageHeader text="Order Edit" />

        <div className="mt-6 max-w-3xl mx-auto grid grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 lg:col-start-1 lg:col-span-2 space-y-6">
            <DraftOrderDetailsSection
              searchTerm={searchTerm}
              setSearchTerm={text => setSearchTerm(text)}
              products={products || []}
              cart={cart}
              onVariantsAdd={onCartItemAdd}
              onVariantRemove={onCartItemRemove}
              onVariantEdit={onCartItemEdit}
              onApplyDiscount={onApplyDiscount}
              onRemoveDiscount={onRemoveDiscount}
              onCreateOrder={onCreateOrder}
            />
          </section>

          <section className="lg:col-start-3 lg:col-span-1 space-y-6">
            {order.customer ? (
              <CustomerEdit
                order={data}
                onCustomerRemove={() => onAttachCustomer()}
                onChange={(field, value) => setData(field, value)}
                onCustomerAddressSave={onCustomerAddressSave}
                onContactSave={attributes => setData({...data, ...attributes})}
              />
            ) : (
              <CustomerSelect
                searchTerm={customerSearchTerm}
                setSearchTerm={text => setCustomerSearchTerm(text)}
                customers={customers || []}
                onCustomerCreate={onCustomerCreate}
                onCustomerSelect={customer => onAttachCustomer(customer)}
              />
            )}
          </section>
        </div>
      </div>
    </Main>
  );
}
