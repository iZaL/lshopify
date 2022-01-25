import React from 'react';
import Main from '../Main';
import PageHeader from '../components/PageHeader';
import Border from '../components/Border';
import {Customer, Fulfillment, Order, VariantPivot} from '../types';
import {useForm} from '@inertiajs/inertia-react';
import {Inertia} from '@inertiajs/inertia';
import FulfillmentItems from './components/FulfillmentItems';
import Checkbox from '../components/forms/Checkbox';
import Card from '../components/Card';
import Subheader from '../components/Subheader';
import Button from '../components/Button';
import InputText from '../components/forms/InputText';
import route from 'ziggy-js';

interface Props {
  order: Order;
  customers: Customer[];
}

export default function Refund({order}: Props) {
  const {data, setData} = useForm<{
    order: Order;
    restock: boolean;
  }>({
    order: {
      ...order,
      fulfillments: order.fulfillments.map(f => {
        return {
          ...f,
          variants: f.variants.map(v => {
            return {
              ...v,
              pivot_quantity: 0,
            };
          }),
        };
      }),
    },
    restock: true,
  });

  const onVariantQuantityChange = (
    fulfillment: Fulfillment,
    trueVariant: VariantPivot,
    variant: VariantPivot,
    value: number,
  ) => {
    if (value <= trueVariant.pivot_quantity) {
      const fulfillments = data.order.fulfillments.map(f => {
        if (f.id === fulfillment.id) {
          const newVariants = f.variants.map(v => {
            if (v.id === variant.id) {
              return {
                ...v,
                pivot_quantity: value,
              };
            }
            return v;
          });
          return {
            ...f,
            variants: newVariants,
          };
        }
        return f;
      });

      setData({
        ...data,
        order: {
          ...data.order,
          fulfillments: fulfillments,
        },
      });
    }
  };

  const handleSubmit = () => {
    const postData = data.order.fulfillments.map(f => {
      return {
        ...f.variants.map(v => {
          return {
            id: v.id,
            pivot_id: v.pivot_id,
            pivot_quantity: v.pivot_quantity,
          };
        }),
      };
    });

    // @ts-ignore
    Inertia.post(route('lshopify.orders.refund', [order.id]), {
      variants: postData,
    });
  };

  return (
    <Main>
      <div className="p-6">
        <div className="mx-auto max-w-7xl xl:flex xl:items-center xl:justify-between">
          <PageHeader text={order.is_payment_pending ? 'Restock' : 'Refund'} />
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2 lg:col-start-1 ">
            {order.fulfillments.map((fulfillment, i) => {
              return (
                <Card key={i}>
                  <div className="flex flex-row items-center space-x-4 px-5 pt-5 ">
                    <div className="font-bold">
                      Fulfillment #{fulfillment.id}
                    </div>
                    {/*<div className='rounded rounded-xl opacity-90 bg-yellow-400 px-3 text-sm'>*/}
                    {/*  Partially fulfilled*/}
                    {/*</div>*/}
                  </div>

                  <Border />

                  <div className="px-5">
                    <FulfillmentItems
                      variants={
                        data.order.fulfillments.find(
                          f => f.id === fulfillment.id,
                        )?.variants || []
                      }
                      currentVariants={fulfillment.variants || []}
                      onVariantQuantityChange={(trueVariant, variant, value) =>
                        onVariantQuantityChange(
                          fulfillment,
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
              );
            })}

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
  // return (
  //   <Main>
  //     <div className='p-6'>
  //       <div className='max-w-7xl mx-auto xl:flex xl:items-center xl:justify-between'>
  //         <PageHeader text={order.is_payment_pending ? 'Restock' : 'Refund'} />
  //       </div>
  //
  //       <div className='mt-6 max-w-3xl mx-auto grid grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3'>
  //         <section className='lg:col-start-1 lg:col-span-2 space-y-6 '>
  //           <Card>
  //             <div className='pt-5 px-5 flex flex-row items-center space-x-4 '>
  //               <div className='font-bold'>#1008</div>
  //               <div className='rounded rounded-xl opacity-90 bg-yellow-400 px-3 text-sm'>
  //                 Partially fulfilled
  //               </div>
  //             </div>
  //
  //             <Border />
  //
  //             <div className='px-5'>
  //               <FulfillmentItems
  //                 variants={data.order.variants || []}
  //                 currentVariants={order.variants}
  //                 onVariantQuantityChange={onVariantQuantityChange}
  //               />
  //               <div className='py-4 text-sm text-gray-500'>
  //                 Refunded items will be removed from the order.
  //               </div>
  //             </div>
  //
  //             <Border />
  //
  //             <Checkbox
  //               name='restock'
  //               checked={data.restock}
  //               onChange={(e) => setData('restock', e.target.checked)}
  //               label='Restock items'
  //             />
  //
  //             <Border />
  //           </Card>
  //
  //           <Card>
  //             <Subheader text='Reason for refund' />
  //
  //             <InputText name='reason' onChange={() => {}} />
  //
  //             <div className='text-sm text-gray-500'>
  //               Only you and other staff can see this reason
  //             </div>
  //           </Card>
  //         </section>
  //
  //         <section className='lg:col-start-3 lg:col-span-1 space-y-4'>
  //           <Card style='text-sm'>
  //             <Subheader text='Summary' />
  //
  //             <div className='flex flex-row items-center justify-between '>
  //               <div>Items subtotal</div>
  //               <div>OMR 10.00</div>
  //             </div>
  //
  //             <div className='flex flex-row items-center justify-between'>
  //               <div>Tax</div>
  //               <div>OMR 0.00</div>
  //             </div>
  //
  //             <div className='flex flex-row items-center justify-between '>
  //               <div>Shipping</div>
  //               <div>OMR 0.00</div>
  //             </div>
  //
  //             <div className='flex flex-row items-center justify-between'>
  //               <div>Refund total</div>
  //               <div>OMR 0.00</div>
  //             </div>
  //
  //             <Border />
  //
  //             <Subheader text='REFUND AMOUNT' style='text-xs' />
  //             {order.is_payment_pending ? (
  //               <div>This order is pending payment.</div>
  //             ) : (
  //               <div>
  //                 <div>Manual</div>
  //                 <InputText name='amount' onChange={() => {}} />
  //               </div>
  //             )}
  //
  //             <Border />
  //
  //             <Button onClick={() => handleSubmit()} style='w-full'>
  //               <div className='w-full text-center'>
  //                 {order.is_payment_pending ? 'Restock' : 'Refund'} items
  //               </div>
  //             </Button>
  //           </Card>
  //         </section>
  //       </div>
  //     </div>
  //   </Main>
  // );
}
