import {ArrowCircleUpIcon} from '@heroicons/react/solid/esm/index';
import {Link} from '@inertiajs/inertia-react';
import React from 'react';
import route from 'ziggy-js';

export default function FileUploadBox() {
  return (
    <div className="mt-1 sm:mt-0">
      <div className="flex justify-center rounded-md border-2 border-dashed border-gray-500 px-6 pt-5 pb-6">
        <div className="flex flex-col items-center space-y-1">
          <ArrowCircleUpIcon
            className="w-16 text-gray-600"
            aria-hidden="true"
          />
          <Link
            href={route('lshopify.products.create')}
            type="button"
            className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-50">
            {' '}
            Add Files
          </Link>
          <p className="pl-1 pt-5 text-sm text-gray-600">
            or drop files to upload
          </p>
        </div>
      </div>
    </div>
  );
}
