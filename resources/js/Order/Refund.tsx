import {Inertia} from '@inertiajs/inertia';
import {useForm} from '@inertiajs/inertia-react';
import React from 'react';
import route from 'ziggy-js';
import BackButton from '../components/BackButton';
import Border from '../components/Border';
import Button from '../components/Button';
import Card from '../components/Card';
import Checkbox from '../components/forms/Checkbox';
import InputText from '../components/forms/InputText';
import PageHeader from '../components/PageHeader';
import Subheader from '../components/Subheader';
import Main from '../Main';
import {Customer, Order, VariantPivot} from '../types';
import FulfillmentItems from './components/FulfillmentItems';

interface Props {
  order: Order;
  pending_fulfillments: VariantPivot[];
  fulfillments: VariantPivot[];
  customers: Customer[];
}

export default function Refund({
  order,
  pending_fulfillments,
  fulfillments,
}: Props) {
  const {data, setData} = useForm<{
    // order: Order;
    restock: boolean;
    pending_fulfillments: VariantPivot[];
    fulfillments: VariantPivot[];
  }>({
    fulfillments: fulfillments.map(v => ({
      ...v,
      pivot_quantity: 0,
    })),
    pending_fulfillments: pending_fulfillments.map(v => ({
      ...v,
      pivot_quantity: 0,
    })),
    restock: true,
  });

  const onPendingVariantQuantityChange = (
    type: 'pending_fulfillments' | 'fulfillments',
    trueVariant: VariantPivot,
    variant: VariantPivot,
    value: number,
  ) => {
    if (value <= trueVariant.pivot_quantity) {
      let collection =
        type === 'pending_fulfillments'
          ? data.pending_fulfillments
          : data.fulfillments;
      const newVariants = collection.map(v => {
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
        [type]: newVariants,
      });
    }
  };

  const handleSubmit = () => {
    Inertia.post(route('lshopify.orders.refund.store', [order.id]), {
      pending_fulfillments: data.pending_fulfillments || [],
      fulfillments: data.fulfillments || [],
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
            <PageHeader
              text={order.is_payment_pending ? 'Restock' : 'Refund'}
            />
          </div>
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2 lg:col-start-1 ">
            <Card>
              <div className="flex flex-row items-center space-x-4 px-5 pt-5 ">
                <div className="font-bold">Unfulfilled</div>
              </div>

              <Border />

              <div className="px-5">
                <FulfillmentItems
                  variants={data.pending_fulfillments || []}
                  currentVariants={pending_fulfillments || []}
                  onVariantQuantityChange={(trueVariant, variant, value) =>
                    onPendingVariantQuantityChange(
                      'pending_fulfillments',
                      trueVariant,
                      variant,
                      value,
                    )
                  }
                />
                <div className="py-4 text-sm text-gray-500">
                  Refunded items will be removed from the order.
                </div>
              </div>

              <Border />

              <Checkbox
                name="restock"
                checked={data.restock}
                onChange={e => setData('restock', e.target.checked)}
                label="Restock items"
              />

              <Border />
            </Card>

            <Card>
              <div className="flex flex-row items-center space-x-4 px-5 pt-5 ">
                <div className="font-bold">Fulfilled</div>
              </div>

              <Border />

              <div className="px-5">
                <FulfillmentItems
                  variants={data.fulfillments || []}
                  currentVariants={fulfillments || []}
                  onVariantQuantityChange={(trueVariant, variant, value) =>
                    onPendingVariantQuantityChange(
                      'fulfillments',
                      trueVariant,
                      variant,
                      value,
                    )
                  }
                />
                <div className="py-4 text-sm text-gray-500">
                  Refunded items will be removed from the order.
                </div>
              </div>

              <Border />

              <Checkbox
                name="restock"
                checked={data.restock}
                onChange={e => setData('restock', e.target.checked)}
                label="Restock items"
              />

              <Border />
            </Card>

            <Card>
              <Subheader text="Reason for refund" />

              <InputText name="reason" onChange={() => {}} />

              <div className="text-sm text-gray-500">
                Only you and other staff can see this reason
              </div>
            </Card>
          </section>

          <section className="space-y-4 lg:col-span-1 lg:col-start-3">
            <Card cardStyle="text-sm">
              <Subheader text="Summary" />

              <div className="flex flex-row items-center justify-between ">
                <div>Items subtotal</div>
                <div>OMR 10.00</div>
              </div>

              <div className="flex flex-row items-center justify-between">
                <div>Tax</div>
                <div>OMR 0.00</div>
              </div>

              <div className="flex flex-row items-center justify-between ">
                <div>Shipping</div>
                <div>OMR 0.00</div>
              </div>

              <div className="flex flex-row items-center justify-between">
                <div>Refund total</div>
                <div>OMR 0.00</div>
              </div>

              <Border />

              <Subheader text="REFUND AMOUNT" headerStyle="text-xs" />
              {order.is_payment_pending ? (
                <div>This order is pending payment.</div>
              ) : (
                <div>
                  <div>Manual</div>
                  <InputText name="amount" onChange={() => {}} />
                </div>
              )}

              <Border />

              <Button onClick={() => handleSubmit()} buttonStyle="w-full">
                <div className="w-full text-center">
                  {order.is_payment_pending ? 'Restock' : 'Refund'} items
                </div>
              </Button>
            </Card>
          </section>
        </div>
      </div>
    </Main>
  );
}
