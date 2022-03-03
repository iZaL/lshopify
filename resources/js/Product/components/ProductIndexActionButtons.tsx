import React from 'react';
import {Link} from '@inertiajs/inertia-react';
import route from 'ziggy-js';
import Button from '../../components/Button'
import { Inertia } from '@inertiajs/inertia'

export default function ProductIndexActionButtons() {
  return (
    <div className="mt-5 flex xl:mt-0 xl:ml-4 items-center space-x-2">
      <Button
        theme='clear'
        onClick={() => Inertia.get(route('lshopify.home'))}
        buttonStyle='p-2  hover:bg-gray-200'
      >
        Export
      </Button>
      <Button
        theme='clear'
        onClick={() => Inertia.get(route('lshopify.home'))}
        buttonStyle='p-2 hover:bg-gray-200'
      >
        Import
      </Button>
      <Button
        theme='success'
        onClick={() => Inertia.get(route('lshopify.products.create'))}
      >
        Add product
      </Button>
    </div>
  );
}
