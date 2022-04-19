import {ShoppingCartIcon, SpeakerphoneIcon} from '@heroicons/react/outline';
import {Inertia} from '@inertiajs/inertia';
import classNames from 'classnames';
import React from 'react';
import route from 'ziggy-js';
import Button from '../components/Button';
import PageHeader from '../components/PageHeader';
import Main from '../Main';
import IndexActionButtons from './components/IndexActionButtons';

interface TabProps {
  name: string;
  href: string;
}

interface Props {}

const tabs: TabProps[] = [
  {name: 'Discount codes', href: '#'},
  {name: 'Automatic discounts', href: '#'},
];

export default function DiscountIndex(props: Props) {
  const [activeTab, setActiveTab] = React.useState<TabProps>(tabs[0]);

  function DiscountCodeTab() {
    if (activeTab.name !== 'Discount codes') {
      return null;
    }
    return (
      <div className="text-center w-96">
        <div className="flex flex-row items-center justify-center content-center">
          <SpeakerphoneIcon className="w-20 text-gray-600" />
        </div>

        <div className="mt-2 text-xl">Manage discounts and promotions</div>
        <div className="mt-4 text-sm text-gray-500 font-light">
          Discount codes are a great way to offer a discount to your customers.
          You can create one for each product, or for an entire order.
        </div>

        <div className="mt-4">
          <Button
            onClick={() => Inertia.get(route('lshopify.discounts.create'))}>
            Create discount code
          </Button>
        </div>
      </div>
    );
  }

  function AutomaticDiscountTab() {
    if (activeTab.name !== 'Automatic discounts') {
      return null;
    }
    return (
      <div className="text-center w-96">
        <div className="flex flex-row items-center justify-center content-center">
          <ShoppingCartIcon className="w-20 text-gray-600" />
        </div>
        <div className="mt-2 text-xl">
          Create discounts that apply automatically
        </div>
        <div className="mt-4 text-sm text-gray-500 font-light">
          Create and manage discounts that apply automatically to a customer’s
          cart.
        </div>

        <div className="mt-4">
          <Button
            onClick={() =>
              Inertia.get(
                route('lshopify.discounts.create', {type: 'automatic'}),
              )
            }>
            Create automatic discount
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Main>
      <div className="p-6">
        <div className="mx-auto max-w-7xl xl:flex xl:items-center xl:justify-between">
          <PageHeader text="Discounts" />
          <IndexActionButtons />
        </div>

        <div className="mx-auto max-w-7xl py-6">
          <section className="rounded-lg bg-white shadow">
            <div className="hidden md:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-2">
                  {tabs.map(tab => (
                    <a
                      key={tab.name}
                      href={tab.href}
                      className={classNames(
                        activeTab.name === tab.name
                          ? 'border-green-800 text-green-800'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'mx-2 whitespace-nowrap border-b-2 py-3 px-6 text-sm font-medium',
                      )}
                      onClick={() => setActiveTab(tab)}>
                      {tab.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>

            <div className="flex h-96 items-center justify-center">
              <DiscountCodeTab />
              <AutomaticDiscountTab />
            </div>
          </section>
        </div>
      </div>
    </Main>
  );
}
