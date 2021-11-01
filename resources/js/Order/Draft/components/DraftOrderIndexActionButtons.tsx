import React from 'react';
import {Link} from '@inertiajs/inertia-react';
import route from "ziggy-js";

interface Props {}

export default function DraftOrderIndexActionButtons({}: Props) {
  return (
    <div className='mt-5 flex xl:mt-0 xl:ml-4'>
      <div className=''>
        <Link
          href={route('lshopify.home')}
          className='inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 '
        >
          Export
        </Link>
      </div>

      <div className='ml-3'>
        <Link
          href={route('lshopify.orders.draft.create')}
          type='button'
          className='inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-900'
        >
          Create Order
        </Link>
      </div>
    </div>
  );
}
