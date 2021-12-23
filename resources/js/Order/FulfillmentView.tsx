import React, {useEffect} from 'react';
import Main from '../Main';
import {navigationActiveState} from '../atoms';
import {useSetRecoilState} from 'recoil';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Subheader from '../components/Subheader';
import Border from '../components/Border';
import {
  Billing,
  Customer,
  CustomerAddress,
  Fulfillment,
  Order,
  Shipping,
  VariantPivot,
} from '../types';
import {useForm} from '@inertiajs/inertia-react';
import {Inertia} from '@inertiajs/inertia';
import {CustomerForm} from '../form_types';
import AddressCard from '../Customer/components/AddressCard';
import FulfillmentItems from './components/FulfillmentItems';
import ShippingInfo from './components/ShippingInfo';
import Button from '../components/Button';
import route from 'ziggy-js'

interface Props {
  order: Order;
  fulfillment: Fulfillment;
  customers: Customer[];
}

export default function FulfillmentView({fulfillment, order}: Props) {
  const setNavigation = useSetRecoilState(navigationActiveState);

  const {data, setData} = useForm<{
    order: Order;
    fulfillment: Fulfillment;
  }>({
    order: order,
    fulfillment: fulfillment,
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
      order: {
        ...order,
      },
    });
  }, [order]);

  const onVariantQuantityChange = (trueVariant:VariantPivot, variant: VariantPivot, value: number) => {
    // const trueVariant = fulfillment.variants.find(({id}) => id === variant.id);

    // if (trueVariant) {
      if (value <= trueVariant.pivot_quantity) {
        const newVariants = data.fulfillment.variants.map((v) => {
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
          fulfillment: {
            ...data.fulfillment,
            variants: newVariants,
          },
        });
      }
    // }
  };

  const onAttachCustomer = (customer?: Customer) => {
    Inertia.post(
        route('lshopify.orders.draft.customer.update',[order.id]),
      // `/draft_orders/${order.id}/customer`,
      {
        customer_id: customer ? customer.id : null,
      },
      {
        onSuccess: () => {
          console.log('success');
        },
      }
    );
  };

  const onCustomerCreate = (
    customerData: CustomerForm,
    addressData: CustomerAddress
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
      }
    );
  };

  const onCustomerAddressSave = (
    type: 'shipping' | 'billing',
    address: Shipping | Billing
  ) => {
    Inertia.patch(`/orders/${order.id}`, {
      [type]: address,
    });
  };

  const handleSubmit = () => {
    Inertia.post(
        route('lshopify.orders.fulfill',[order.id,fulfillment.id]),
        // `/orders/${order.id}/fulfillments/${fulfillment.id}/fulfill`,
      {
        ...data.fulfillment,
      },
      {
        onSuccess: () => {
          console.log('success');
        },
      }
    );
  };

  return (
    <Main>
      <div className='p-6'>
        <div className='max-w-7xl mx-auto xl:flex xl:items-center xl:justify-between'>
          <PageHeader text={`Fulfill Items`} />
        </div>

        <div className='mt-6 max-w-3xl mx-auto grid grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3'>
          <section className='lg:col-start-1 lg:col-span-2 space-y-6 '>
            <Card>
              <div className='pt-5 px-5 flex flex-row items-center space-x-4 '>
                <div className='font-bold'>#1008</div>
                <div className='rounded rounded-xl opacity-90 bg-yellow-400 px-3 text-sm'>
                  Partially fulfilled
                </div>
              </div>

              <Border />

              <div className='px-5'>
                <FulfillmentItems
                  variants={data.fulfillment.variants || []}
                  currentVariants={fulfillment.variants}
                  onVariantQuantityChange={onVariantQuantityChange}
                />
              </div>

              <Border />

              <ShippingInfo />

              <Border />

              <div className='flex justify-end pb-5 px-5'>
                <Button style='w-full' onClick={() => handleSubmit()}>
                  <div className='w-full text-center'>Fulfill Items</div>
                </Button>
              </div>
            </Card>
          </section>

          <section className='lg:col-start-3 lg:col-span-1 space-y-4'>
            <Card>
              <AddressCard
                address={order.billing}
                onSave={(attributes) =>
                  onCustomerAddressSave('billing', attributes)
                }
                title='SHIPPING ADDRESS'
              />
            </Card>
          </section>
        </div>
      </div>
    </Main>
  );
}
