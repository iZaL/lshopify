import React, {useEffect, useState} from 'react';
import Main from '../../Main';
import PageHeader from '../../components/PageHeader';
import FormSubmitBar from '../../components/FormSubmitBar';
import {Inertia} from '@inertiajs/inertia';
import {useForm} from '@inertiajs/inertia-react';
import {
  Billing,
  Cart,
  CartDiscount,
  CartItem,
  Customer,
  CustomerAddress,
  Order,
  Product,
  Shipping,
} from '../../types';
import DraftOrderDetailsSection from './components/DraftOrderDetailsSection';
import CustomerSelect from './components/CustomerSelect';
import CustomerEdit from './components/CustomerEdit';
import route from 'ziggy-js';
import {CustomerForm} from '../../form_types';
import BackButton from '../../components/BackButton';

interface Props {
  products: Product[];
  cart: Cart;
  order: Order;
  customers: Customer[];
}

export default function DraftOrderEdit(props: Props) {
  const {products, cart, order, customers} = props;

  const [searchTerm, setSearchTerm] = useState('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');

  const {data, setData} = useForm<Order & {_method: 'PATCH'}>({
    ...order,
    _method: 'PATCH',
  });

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

  const onCartItemEdit = (rowId: string, item: CartItem) => {
    Inertia.post(route('lshopify.cart.update'), {
      rowId: rowId,
      item: item,
      orderID: order.id,
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

  const onCustomerCreate = (customerData: CustomerForm, addressData: CustomerAddress) => {
    Inertia.post(route('lshopify.customers.store'), {
      customer: customerData,
      address: addressData,
    });
  };

  const onAttachCustomer = (customer?: Customer) => {
    Inertia.post(route('lshopify.draft.orders.customer.update', [order.id]), {
      customer_id: customer ? customer.id : null,
    });
  };

  const onCreateOrder = () => {
    Inertia.post(route('lshopify.draft.orders.confirm', [order.id]));
  };

  const handleSubmit = (extraData?: {[x: string]: any}) => {
    let postData = data;
    if (extraData) {
      postData = {
        ...data,
        ...extraData,
      };
    }
    Inertia.post(route('lshopify.draft.orders.update', [order.id]), postData);
  };

  const onCustomerAddressSave = (type: 'shipping' | 'billing', address: Shipping | Billing) => {
    handleSubmit({
      [type]: {
        ...address,
      },
    });
  };

  return (
    <Main>
      <div className="p-6">
        <FormSubmitBar onSubmit={handleSubmit} />

        <div className="flex flex-row items-center space-x-2">
          <BackButton
            onClick={() => {
              Inertia.get(route('lshopify.draft.orders.index'));
            }}
          />
          <PageHeader text={`Order Edit`} />
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 space-y-6 lg:col-span-2 lg:col-start-1">
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

          <section className="space-y-6 lg:col-span-1 lg:col-start-3">
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
