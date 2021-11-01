import React from 'react';
import Border from '../../../components/Border';
import DropdownButton from '../../../components/DropdownButton';

interface Props {}

export default function Refunded({}: Props) {
  return (
    <>
      <div className='mx-auto grid grid-cols-1 grid-flow-col-dense grid-cols-5 text-sm'>
        <div className='col-start-1 space-y-2'>
          <div>Discount</div>
        </div>

        <div className='col-start-2 col-span-3 space-y-2 '>Custom discount</div>

        <div className='col-start-5 space-y-2 text-right'>
          <div className=''>OMR 10.00</div>
        </div>

        <div className='col-start-1 space-y-2'>
          <div>Subtotal</div>
          <div>Total</div>
        </div>

        <div className='col-start-2 col-span-3 space-y-2 '>counting</div>

        <div className='col-start-5 space-y-2 text-right'>
          <div className=''>OMR 10.00</div>
          <div>OMR 10.00</div>
        </div>

        <div className='col-start-1 col-span-5'>
          <Border />
        </div>

        <div className='col-start-1 space-y-2'>
          <div>Paid by customer</div>
        </div>

        <div className='col-start-5 space-y-2 text-right'>
          <div>OMR 10.00</div>
        </div>
      </div>

      <Border />

      <div className='flex justify-end'>
        <DropdownButton
          buttonTitle='Collect payment'
          arrowVisible={true}
          items={[
            {
              title: 'View',
              onClick: () => {},
            },
            {
              title: 'Cancel',
              onClick: () => {},
            },
          ]}
        />
      </div>
    </>
  );
}
