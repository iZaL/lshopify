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
  VariantPivot,
} from '../types';
import OrderItems from './components/OrderItems';
import Card from '../components/Card';
import Button from '../components/Button';
import Border from '../components/Border';
import Subheader from '../components/Subheader';
import {Inertia} from '@inertiajs/inertia';
import CustomerEdit from './Draft/components/CustomerEdit';
import CustomerSelect from './Draft/components/CustomerSelect';
import {useForm} from '@inertiajs/inertia-react';
import PaymentPaid from './Payment/components/PaymentPaid';
import PaymentPending from './Payment/components/PaymentPending';
import OrderViewActionButtons from './components/OrderViewActionButtons';
import route from 'ziggy-js';
import {CustomerForm} from '../form_types';
import BackButton from '../components/BackButton';
import DropdownButton from '../components/DropdownButton';
import {
  DotsHorizontalIcon,
  DotsVerticalIcon,
  SupportIcon,
} from '@heroicons/react/outline';
import {Warning} from 'postcss';
import {CheckCircleIcon} from '@heroicons/react/outline';

interface Props {
  order: Order;
  customers: Customer[];
  pending_fulfillments: {
    data: VariantPivot[];
    unfulfilled_variants_count: string;
  };
}

export default function OrderView(props: Props) {
  console.log('props', props);

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
    Inertia.get(
      route('lshopify.orders.fulfillments', [order.id, fulfillment.id]),
    );
  };

  const fulfill = () => {
    return Inertia.get(route('lshopify.orders.fulfillments', [order.id]));
  };

  const cancelFulfillment = (fulfillment: Fulfillment) => {
    console.log('f', fulfillment);
  };

  const refund = () => {
    Inertia.get(route('lshopify.orders.refund', [order.id]));
  };

  const returnItems = () => {
    Inertia.get(route('lshopify.orders.return', [order.id]));
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

          <OrderViewActionButtons
            onRefundClick={() => refund()}
            onReturnClick={() => returnItems()}
          />
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2 lg:col-start-1 ">
            {props.pending_fulfillments.data?.length ? (
              <Card cardStyle="p-0">
                <div className="flex flex-row items-center space-x-2">
                  <SupportIcon className="h-7 w-7 text-orange-400" />
                  <Subheader
                    text={`Unfulfilled (${props.pending_fulfillments.unfulfilled_variants_count})`}
                  />
                </div>
                <OrderItems
                  variants={props.pending_fulfillments.data}
                  onItemClick={() => {}}
                />
                <Border />
                <div className="flex justify-end">
                  <Button onClick={() => fulfill()}>Fulfill items</Button>
                </div>
              </Card>
            ) : null}

            {order.workflows.map((fulfillment, i) => (
              <Card cardStyle="p-0" key={i}>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row items-center space-x-2">
                    {fulfillment.status === 'success' ? (
                      <CheckCircleIcon className="h-7 w-7 text-green-500" />
                    ) : (
                      <SupportIcon className="h-7 w-7 text-orange-400" />
                    )}
                    <Subheader text={`${fulfillment.title}`} />
                    <div>#{fulfillment.id}</div>
                  </div>

                  <div>
                    {fulfillment.can_cancel && (
                      <div className="relative">
                        <DropdownButton
                          buttonIcon={
                            <DotsHorizontalIcon
                              className="h-5 w-5 font-bold text-gray-500 hover:text-gray-800"
                              aria-hidden="true"
                            />
                          }
                          items={[
                            {
                              title: 'Print packing slip',
                              onClick: () => {
                                {
                                }
                              },
                            },
                            {
                              title: 'Cancel fulfillment',
                              onClick: () => cancelFulfillment(fulfillment),
                              itemStyle: 'text-red-500',
                            },
                          ]}
                          buttonProps={{
                            theme: 'clear',
                            buttonStyle: 'text-blue-500',
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <OrderItems
                  variants={fulfillment.variants}
                  onItemClick={() => {}}
                />

                <Border />

                <div className="flex justify-end space-x-4">
                  {fulfillment.can_add_tracking && (
                    <Button onClick={() => markAsFulfilled(fulfillment)}>
                      Add tracking
                    </Button>
                  )}
                  {fulfillment.can_mark_as_returned && (
                    <Button onClick={() => {}}>Mark as returned</Button>
                  )}
                </div>
              </Card>
            ))}

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
