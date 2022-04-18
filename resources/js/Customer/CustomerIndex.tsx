import React from 'react'
import Main from '../Main'
import PageHeader from '../components/PageHeader'
import CustomerIndexActionButtons from './components/CustomerIndexActionButtons'
import CustomersList from './components/CustomersList'
import { Customer } from '../types'

interface Props {
  customers: {
    data:Customer[]
  }
}

export default function CustomerIndex(props: Props) {

  const {customers} = props;

  return (
    <Main>
      <div className="p-6">
        <div className="mx-auto max-w-7xl xl:flex xl:items-center xl:justify-between">
          <PageHeader text={'Customers'} />
          <CustomerIndexActionButtons />
        </div>

        <div className="mx-auto max-w-7xl py-6 ">
          <section className="rounded-lg bg-white shadow">
            <CustomersList
              customers={customers.data}
            />
          </section>
        </div>
      </div>
    </Main>
  );
}
