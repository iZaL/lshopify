import React from 'react';
import route from 'ziggy-js';
import Button from '../../components/Button';
import {Inertia} from '@inertiajs/inertia';

export default function CustomerIndexActionButtons() {
  return (
    <div className="mt-5 flex items-center space-x-2 xl:mt-0 xl:ml-4">
      <Button
        theme="clear"
        onClick={() => Inertia.get(route('lshopify.home'))}
        buttonStyle="p-2  hover:bg-gray-200">
        Export
      </Button>
      <Button
        theme="clear"
        onClick={() => Inertia.get(route('lshopify.home'))}
        buttonStyle="p-2 hover:bg-gray-200">
        Import
      </Button>
      <Button
        theme="success"
        onClick={() => Inertia.get(route('lshopify.products.create'))}>
        Add product
      </Button>
    </div>
  );
}
