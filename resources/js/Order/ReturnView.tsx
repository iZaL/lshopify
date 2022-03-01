import React from 'react';
import Main from '../Main';
import PageHeader from '../components/PageHeader';
import Border from '../components/Border';
import {Order, VariantPivot} from '../types';
import {useForm} from '@inertiajs/inertia-react';
import {Inertia} from '@inertiajs/inertia';
import FulfillmentItems from './components/FulfillmentItems';
import Card from '../components/Card';
import Subheader from '../components/Subheader';
import Button from '../components/Button';
import InputText from '../components/forms/InputText';
import BackButton from '../components/BackButton';
import Select from '../components/forms/Select';
import route from 'ziggy-js';

interface Props {
  order: Order;
  fulfillments: VariantPivot[];
}

export default function Refund({order, fulfillments}: Props) {
  const {data, setData} = useForm<{
    fulfillments: VariantPivot[];
  }>({
    fulfillments: fulfillments.map(v => ({
      ...v,
      pivot_quantity: 0,
    })),
  });

  const onPendingVariantQuantityChange = (
    type: 'pending_fulfillments' | 'fulfillments',
    trueVariant: VariantPivot,
    variant: VariantPivot,
    value: number,
  ) => {
    if (value <= trueVariant.pivot_quantity) {
      const newVariants = data.fulfillments.map(v => {
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
    Inertia.post(route('lshopify.orders.refund', [order.id]), {
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
            <PageHeader text={'Return items'} />
          </div>
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2 lg:col-start-1 ">
            <Card>
              <div className="flex flex-row items-center space-x-4 px-5 pt-5 ">
                <div className="font-bold">Fulfillments</div>
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

                <div className="mt-4 py-2 text-sm text-gray-500">
                  Select a reason to return.
                </div>
                <div className="flex flex-row space-x-2">
                  <div className="flex-1">
                    <Select name={'reason'} onChange={() => {}}>
                      <option value={'unknown'}>Unknown</option>
                      <option value={'wrong_item'}>Received wrong item</option>
                      <option value={'change_mind'}>
                        Customer changed their mind
                      </option>
                      <option value={'not_as_described'}>
                        Item not as described
                      </option>
                      <option value={'other'}>Other</option>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <InputText
                      inputStyle="flex-1"
                      name={'other_reason'}
                      onChange={() => {}}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Some items have already been refunded and can’t be returned.

                </div>
              </div>

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
                <div>Return 1 item</div>
                <div>Reason: other</div>
              </div>

              <Border />

              <Button onClick={() => handleSubmit()} buttonStyle="w-full">
                <div className="w-full text-center">Create return</div>
              </Button>
            </Card>
          </section>
        </div>
      </div>
    </Main>
  );
}
