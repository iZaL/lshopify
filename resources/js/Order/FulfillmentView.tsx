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

interface Props {
  order: Order;
  // fulfillment: Fulfillment;
  pending_fulfillments:VariantPivot[];
  customers: Customer[];
}

export default function FulfillmentView({ order, pending_fulfillments}: Props) {
  const {data, setData} = useForm<{
    order: Order;
    // fulfillment: Fulfillment;
  }>({
    order: order,
    // fulfillment: fulfillment,
  });

  useEffect(() => {
    setData({
      ...data,
      order: {
        ...order,
      },
    });
  }, [order]);

  const onVariantQuantityChange = (
    trueVariant: VariantPivot,
    variant: VariantPivot,
    value: number,
  ) => {
    if (value <= trueVariant.pivot_quantity) {
      // const newVariants = data.fulfillment.variants.map(v => {
      //   if (v.id === variant.id) {
      //     return {
      //       ...v,
      //       pivot_quantity: value,
      //     };
      //   }
      //   return v;
      // });
      // setData({
      //   ...data,
      //   fulfillment: {
      //     ...data.fulfillment,
      //     variants: newVariants,
      //   },
      // });
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
    // Inertia.post(
      // route('lshopify.orders.fulfill', [order.id, fulfillment.id]),
      // {
      //   ...data.fulfillment,
      // },
      // {
      //   onSuccess: () => {
      //     console.log('success');
      //   },
      // },
    // );
  };

  return (
    <Main>
      <div className="p-6">
        <div className="mx-auto max-w-7xl xl:flex xl:items-center xl:justify-between">
          <PageHeader text={`Fulfill Items`} />
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
                  variants={pending_fulfillments || []}
                  currentVariants={pending_fulfillments || []}
                  // currentVariants={fulfillment.variants}
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
