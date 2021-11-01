import React from 'react';
import {ArrowCircleUpIcon} from '@heroicons/react/solid/esm/index';
import {Link} from '@inertiajs/inertia-react';
import route from "ziggy-js";

interface TextAreaProps {}

export default function FileUploadBox({}: TextAreaProps) {
  return (
    <div className='mt-1 sm:mt-0'>
      <div className='flex justify-center px-6 pt-5 pb-6 border-2 border-gray-500 border-dashed rounded-md'>
        <div className='flex flex-col items-center space-y-1'>
          <ArrowCircleUpIcon
            className='w-16 text-gray-600'
            aria-hidden='true'
          />
          <Link
            href={route('lshopify.products.create')}
            type='button'
            className='inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-purple-500'
          >
            {' '}
            Add Files
          </Link>
          <p className='pl-1 text-sm text-gray-600 pt-5'>
            or drop files to upload
          </p>
        </div>
      </div>
    </div>
  );
}
