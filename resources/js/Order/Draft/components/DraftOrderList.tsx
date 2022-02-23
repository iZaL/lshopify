import React from 'react';
import {Order} from '../../../types';
import Checkbox from '../../../components/forms/Checkbox'
import VariantImage from '../../../Product/Variant/components/VariantImage'
import Button from '../../../components/Button'
import THead from '../../../components/THead'
import TD from '../../../components/TD'

interface Props {
  orders: Order[];
  onItemClick: (order: Order) => void;
}

export default function DraftOrderList({orders, onItemClick}: Props) {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <THead />
                  <THead title='Draft order' />
                  <THead title='Date' />
                  <THead title='Customer' />
                  <THead title='Status' />
                  <THead title='Total' />
                </tr>
              </thead>
              <tbody>
              {orders.map((order, id) => (
                <tr
                  key={order.id}
                  className={`${id % 2 === 0 ? 'bg-white' : 'bg-gray-50'} `}>
                  <TD>
                    <div className="flex w-12 items-center justify-center">
                      <Checkbox checked={false} onChange={() => {}} name="" />
                    </div>
                  </TD>
                  <TD>#{order.id}</TD>
                  <TD>{order.date}</TD>
                  <TD>{order.customer?.first_name || '--'}</TD>
                  <TD>{order.status}</TD>
                  <TD>{order.total_formatted}</TD>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

}
