import React, {useEffect, useState} from 'react';
import Main from '../Main';
import PageHeader from './../components/PageHeader';
import {
  Billing,
  Customer,
  CustomerAddress,
  Fulfillment,
  Order,
  Shipping,
} from '../types';
import OrderItems from './components/OrderItems';
import Card from '../components/Card';
import Button from '../components/Button';
import Border from '../components/Border';
import Subheader from '../components/Subheader';
import {Inertia} from '@inertiajs/inertia';
import DropdownButton from '../components/DropdownButton';
import CustomerEdit from './Draft/components/CustomerEdit';
import CustomerSelect from './Draft/components/CustomerSelect';
import {useForm} from '@inertiajs/inertia-react';
import PaymentPaid from './Payment/components/PaymentPaid';
import PaymentPending from './Payment/components/PaymentPending';
import OrderViewActionButtons from './components/OrderViewActionButtons';
import route from 'ziggy-js';
import {CustomerForm} from '../form_types';
import BackButton from '../components/BackButton';

interface Props {
  order: Order;
  customers: Customer[];
}

export default function OrderView(props: Props) {
  const {order, customers} = props;

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
  }, [order]);

  const onCustomerCreate = (
    customerData: CustomerForm,
    addressData: CustomerAddress,
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
      route('lshopify.orders.customer.update', [order.id]),
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
    Inertia.patch(route('lshopify.orders.update', [order.id]), {
      [type]: address,
    });
  };

  const updateOrderAttributes = (attributes: Partial<Order>) => {
    Inertia.patch(route('lshopify.orders.update', [order.id]), {
      ...attributes,
    });
  };

  const markAsPaid = () => {
    Inertia.post(route('lshopify.orders.payments.store', [order.id]));
  };

  const markAsFulfilled = (fulfillment: Fulfillment) => {
    Inertia.get(route('lshopify.orders.fulfill', [order.id, fulfillment.id]));
  };

  const refund = () => {
    Inertia.get(route('lshopify.orders.refund', [order.id]));
  };

  return (
    <Main>
      <div className="p-6">
        <div className="flex flex-row space-x-2 xl:justify-between">
          <div className="flex flex-row space-x-2">
            <BackButton
              onClick={() => {
                Inertia.get(route('lshopify.orders.index'));
              }}
            />
            <PageHeader text={`Order Edit`} />
          </div>

          <OrderViewActionButtons onRefundClick={() => refund()} />
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2 lg:col-start-1 ">
            {order.pending_fulfillments?.map((fulfillment, i) => (
              <Card cardStyle="p-0" key={i}>
                <Subheader text="Unfulfilled" />
                <OrderItems
                  variants={fulfillment.variants}
                  onItemClick={() => {}}
                />
                <Border />
                <div className="flex justify-end">
                  <Button onClick={() => markAsFulfilled(fulfillment)}>
                    Fulfill items
                  </Button>
                </div>
              </Card>
            ))}

            {order.success_fulfillments?.map((fulfillment, i) => (
              <Card cardStyle="p-0" key={i}>
                <Subheader text={`Fulfilled #${fulfillment.id}`} />
                <OrderItems
                  variants={fulfillment.variants}
                  onItemClick={() => {}}
                />
                <Border />

                <div className="flex justify-end space-x-4">
                  <Button onClick={() => markAsFulfilled(fulfillment)}>
                    Add tracking
                  </Button>
                </div>
              </Card>
            ))}

            {order.returns.length ? (
              <Card cardStyle="p-0">
                <Subheader text={`Returned`} />
                <OrderItems variants={order.returns} onItemClick={() => {}} />
                <Border />

                <div className="flex justify-end space-x-4">
                  <DropdownButton
                    buttonTitle="More"
                    items={[
                      {title: 'View', onClick: () => {}},
                      {title: 'Cancel', onClick: () => {}},
                    ]}
                    buttonProps={{
                      theme: 'default',
                    }}
                    arrowVisible={true}
                  />

                  <Button onClick={() => {}}>Add Tracking</Button>
                </div>
              </Card>
            ) : null}

            {order.is_payment_pending && (
              <Card>
                <Subheader text="Pending" />
                <PaymentPending order={order} onPaidClick={markAsPaid} />
              </Card>
            )}

            {order.payments?.map((payment, i) => (
              <Card cardStyle="p-0" key={i}>
                <Subheader text="Paid" />
                <PaymentPaid payment={payment} quantity={order.quantity} />
              </Card>
            ))}
          </section>

          <section className="space-y-6 lg:col-span-1 lg:col-start-3">
            {order.customer ? (
              <CustomerEdit
                order={data}
                onCustomerRemove={() => onAttachCustomer()}
                onChange={(field, value) => setData(field, value)}
                onCustomerAddressSave={onCustomerAddressSave}
                onContactSave={attributes =>
                  // setData({...data, ...attributes});
                  updateOrderAttributes(attributes)
                }
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
