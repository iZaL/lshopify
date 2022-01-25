import React from 'react';
import {Link} from '@inertiajs/inertia-react';
import route from 'ziggy-js';

export default function CollectionIndexActionButtons() {
  return (
    <div className="mt-5 flex xl:mt-0 xl:ml-4">
      <div className="">
        <Link
          href={route('lshopify.home')}
          className="inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ">
          Export
        </Link>
      </div>

      <div className="ml-3">
        <Link
          href={route('lshopify.collections.create')}
          type="button"
          className="inline-flex items-center rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-900">
          Create Collection
        </Link>
      </div>
    </div>
  );
}
