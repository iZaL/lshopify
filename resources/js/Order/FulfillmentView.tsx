import React, {useEffect} from 'react';
import Main from '../Main';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Border from '../components/Border';
import {
  Billing,
  Customer,
  Fulfillment,
  Order,
  Shipping,
  VariantPivot,
} from '../types';
import {useForm} from '@inertiajs/inertia-react';
import {Inertia} from '@inertiajs/inertia';
import AddressCard from '../Customer/components/AddressCard';
import FulfillmentItems from './components/FulfillmentItems';
import ShippingInfo from './components/ShippingInfo';
import Button from '../components/Button';
import route from 'ziggy-js';
import BackButton from '../components/BackButton';

interface Props {
  order: Order;
  pending_fulfillments: VariantPivot[];
  customers: Customer[];
}

export default function FulfillmentView({order, pending_fulfillments}: Props) {
  const {data, setData} = useForm<{
    pending_fulfillments: VariantPivot[];
  }>({
    pending_fulfillments: pending_fulfillments,
  });

  useEffect(() => {
    setData({
      ...data,
      pending_fulfillments: pending_fulfillments,
    });
  }, [order]);

  const onVariantQuantityChange = (
    trueVariant: VariantPivot,
    variant: VariantPivot,
    value: number,
  ) => {
    if (value <= trueVariant.pivot_quantity) {
      const newVariants = data.pending_fulfillments.map(v => {
        if (v.id === variant.id) {
          return {
            ...v,
            pivot_quantity: value,
          };
        }
        return v;
      });
      setData({
        ...data,
        pending_fulfillments: newVariants,
      });
    }
  };

  const onCustomerAddressSave = (
    type: 'shipping' | 'billing',
    address: Shipping | Billing,
  ) => {
    Inertia.patch(route('lshopify.orders.update', [order.id]), {
      [type]: address,
    });
  };

  const handleSubmit = () => {
    Inertia.post(route('lshopify.orders.fulfillments.store', [order.id]), {
      variants: data.pending_fulfillments,
    });
  };

  return (
    <Main>
      <div className="p-6">
        <div className="flex flex-row space-x-2 xl:justify-between">
          <div className="flex flex-row space-x-2">
            <BackButton
              onClick={() => {
                Inertia.get(route('lshopify.orders.show', [order.id]));
              }}
            />
            <PageHeader text={'Fulfillment Items'} />
          </div>
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2 lg:col-start-1 ">
            <Card>
              <div className="flex flex-row items-center space-x-4 px-5 pt-5 ">
                <div className="font-bold">#1008</div>
                <div className="rounded rounded-xl bg-yellow-400 px-3 text-sm opacity-90">
                  Partially fulfilled
                </div>
              </div>

              <Border />

              <div className="px-5">
                <FulfillmentItems
                  variants={data.pending_fulfillments || []}
                  currentVariants={pending_fulfillments || []}
                  onVariantQuantityChange={onVariantQuantityChange}
                />
              </div>

              <Border />

              <ShippingInfo />

              <Border />

              <div className="flex justify-end px-5 pb-5">
                <Button buttonStyle="w-full" onClick={() => handleSubmit()}>
                  <div className="w-full text-center">Fulfill Items</div>
                </Button>
              </div>
            </Card>
          </section>

          <section className="space-y-4 lg:col-span-1 lg:col-start-3">
            <Card>
              <AddressCard
                address={order.billing}
                onSave={attributes =>
                  onCustomerAddressSave('billing', attributes)
                }
                title="SHIPPING ADDRESS"
              />
            </Card>
          </section>
        </div>
      </div>
    </Main>
  );
}
