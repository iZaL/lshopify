import {Inertia} from '@inertiajs/inertia';
import {useForm} from '@inertiajs/inertia-react';
import {format} from 'date-fns';
import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import route from 'ziggy-js';

import BackButton from '../components/BackButton';
import Border from '../components/Border';
import Button from '../components/Button';
import Card from '../components/Card';
import Checkbox from '../components/forms/Checkbox';
import InputText from '../components/forms/InputText';
import Label from '../components/forms/Label';
import FormSubmitBar from '../components/FormSubmitBar';
import PageHeader from '../components/PageHeader';
import Subheader from '../components/Subheader';
import Main from '../Main';
import { Customer } from '../types'
import CustomerSelection from '../Customer/components/CustomerSelection'

interface Discount {
  title: string | null;
  code: string;
  type: 'code' | 'automatic';
  value: string;
  value_type: 'fixed_amount' | 'percentage';
  target_type: 'all_products' | 'products' | 'collections';
  min_requirement_type: 'amount' | 'quantity' | null;
  min_requirement_value: string;
  once_per_customer: boolean;
  usage_limit: string | null;
  customers: Customer[];
  customer_selection: 'all' | 'custom' | 'none';
}

interface Props {
  discount: Discount;
}

export default function DiscountCreate({discount}: Props) {
  const {data, setData, isDirty} = useForm<Discount>(discount);

  const {
    title,
    code,
    type,
    value,
    value_type,
    target_type,
    min_requirement_type,
    min_requirement_value,
    once_per_customer,
    usage_limit,
    customers,
    customer_selection,
  } = data;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  function generateDiscountCode() {
    // const url = route('lshopify.discounts.generate_disconut_code');
    // Inertia.post(url, data, {
    //   onSuccess: () => {
    //     Inertia.reload();
    //   },
    // });
  }

  function AutomaticDiscountTitle() {
    if(type !== 'automatic') {
      return null;
    }
    return (
      <>
        <Subheader
          headerStyle="first-letter:capitalize"
          text="Automatic discount"
        />
        <div>
          <Label title='Title' />
          <InputText
            name="title"
            placeholder="e.g. Ramadan promotion"
            onChange={e => setData('code', e.target.value)}
            value={code}
          />
          <p className="block py-1 text-sm text-gray-500">
            Customers will see this in cart and at checkout.
          </p>
        </div>
      </>
    );
  }

  function CodeDiscountTitle() {
    if(type !== 'code') {
      return null;
    }
    return (
      <>
        <div className="flex flex-row justify-between">
          <Subheader
            headerStyle="first-letter:capitalize"
            text="Discount code"
          />

          <Button
            theme="clear"
            buttonStyle="text-blue-500 hover:underline"
            onClick={generateDiscountCode}>
            Generate code
          </Button>
        </div>

        <InputText
          name="title"
          placeholder="e.g. CODE2022"
          onChange={e => setData('code', e.target.value)}
          value={code}
        />
        <p className="block py-1 text-sm text-gray-500">
          Customers will enter this discount code at checkout.
        </p>
      </>
    );
  }

  function MinQuantityInput({show}: {show: boolean}) {
    if (!show) return null;
    return (
      <div className="w-56">
        <InputText
          name="min_requirement_value"
          onChange={e => setData('min_requirement_value', e.target.value)}
          value={min_requirement_value}
          rightComponent={
            <span className="text-sm text-gray-400">
              {min_requirement_type === 'amount' ? 'OMR' : ''}
            </span>
          }
        />
        <span className="text-xs text-gray-500">
          Applies{' '}
          {target_type === 'all_products'
            ? 'to  all products'
            : `only to selected ${target_type}`}{' '}
        </span>
      </div>
    );
  }

  const handleSubmit = () => {
    const url = route('lshopify.collections.store');
    Inertia.post(url, data, {
      onSuccess: () => {
        Inertia.reload();
      },
    });
  };

  return (
    <Main>
      <div className="p-6">
        <FormSubmitBar onSubmit={handleSubmit} show={isDirty} />

        <div className="flex flex-row items-center space-x-2">
          <BackButton
            onClick={() => {
              Inertia.get(route('lshopify.discounts.index'));
            }}
          />
          <PageHeader text={`Create ${type} discount`} />
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2 lg:col-start-1">

            <Card>
              <AutomaticDiscountTitle />
              <CodeDiscountTitle />
            </Card>

            <Card>
              <Subheader text="Types" />
              <div className="flex flex-col text-sm space-y-2">
                <div className="inline-flex items-center">
                  <Checkbox
                    type="radio"
                    checked={value_type === 'percentage'}
                    onChange={() => setData('value_type', 'percentage')}
                  />
                  <div className="ml-3">Percentage</div>
                </div>
                <div className="inline-flex items-center">
                  <Checkbox
                    type="radio"
                    checked={value_type === 'fixed_amount'}
                    onChange={() => setData('value_type', 'fixed_amount')}
                  />
                  <div className="ml-3">Fixed amount</div>
                </div>
              </div>
            </Card>

            <Card>
              <Subheader text="Value" />
              <div>
                <Label title="Discount value" />
                <div className="w-56">
                  <InputText
                    name="value"
                    onChange={e => setData('value', e.target.value)}
                    value={value}
                    rightComponent={
                      <span className="text-sm text-gray-400">{value_type === 'percentage' ? '%' : 'OMR'}</span>
                    }
                  />
                </div>
              </div>

              <Border />

              <Subheader headerStyle="text-xs" text="APPLIES TO" />
                <div className="flex flex-col text-sm space-y-2">
                  <div className="inline-flex items-center">
                    <Checkbox
                      type="radio"
                      checked={target_type === 'all_products'}
                      onChange={() => setData('target_type', 'all_products')}
                    />
                    <div className="ml-3">All products</div>
                  </div>
                  <div className="inline-flex items-center">
                    <Checkbox
                      type="radio"
                      checked={target_type === 'products'}
                      onChange={() => setData('target_type', 'products')}
                    />
                    <div className="ml-3">Specific products</div>
                  </div>
                  <div className="inline-flex items-center">
                    <Checkbox
                      type="radio"
                      checked={target_type === 'collections'}
                      onChange={() => setData('target_type', 'collections')}
                    />
                    <div className="ml-3">Specific collections</div>
                  </div>
                </div>
            </Card>

            <Card cardStyle="text-sm">
              <Subheader text="Minimum requirements" />

              <div className=''>
                <div className="inline-flex items-center">
                  <Checkbox
                    type="radio"
                    checked={min_requirement_type === null}
                    onChange={() => setData('min_requirement_type', null)}
                  />
                  <div className="ml-3">None</div>
                </div>

                <div className="relative flex items-start pt-1">
                  <div className="flex h-5 items-center">
                    <Checkbox
                      type="radio"
                      checked={min_requirement_type === 'amount'}
                      onChange={() => setData('min_requirement_type', 'amount')}
                    />
                  </div>
                  <div className="ml-3">
                    <div>Minimum purchase amount (OMR)</div>
                    <MinQuantityInput show={min_requirement_type === 'amount'} />
                  </div>
                </div>

                <div className="relative flex items-start pt-2">
                  <div className="flex h-5 items-center">
                    <Checkbox
                      type="radio"
                      checked={min_requirement_type === 'quantity'}
                      onChange={() => setData('min_requirement_type', 'quantity')}
                    />
                  </div>
                  <div className="ml-3">
                    <div>Minimum quantity of items</div>
                    <MinQuantityInput
                      show={min_requirement_type === 'quantity'}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card cardStyle="text-sm">
              <Subheader text="Customer eligibility" />
              <div className=''>
                <div className="inline-flex items-center">
                  <Checkbox
                    type="radio"
                    checked={customer_selection === 'all'}
                    onChange={() => setData('customer_selection', 'all')}
                  />
                  <div className="ml-3">Everyone</div>
                </div>

                <div className="relative flex items-start pt-1">
                  <div className="flex h-5 items-center">
                    <Checkbox
                      type="radio"
                      checked={customer_selection === 'custom'}
                      onChange={() => setData('customer_selection','custom')}
                    />
                  </div>
                  <div className="ml-3">
                    <div>Specific customers</div>
                    {/*<MinQuantityInput show={min_requirement_type === 'amount'} />*/}
                  </div>
                </div>

                {
                  customer_selection === 'custom' && (
                    <CustomerSelection
                      searchTerm={''}
                      sortTerm={''}
                      customers={[]}
                      selectedCustomers={[]}
                      onChange={(field, value) => setData(field, value)}
                      onAddProducts={() => {}}
                      onSearch={() => {}}
                    />
                  )
                }


              </div>
            </Card>

            <Card cardStyle="text-sm">
              <Subheader text="Usage limits" />

              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                  <Checkbox
                    checked={usage_limit !== null}
                    onChange={e =>
                      setData('usage_limit', e.target.checked ? '1' : null)
                    }
                  />
                </div>
                <div className="ml-3">
                  <div>
                    Limit number of times this discount can be used in total
                  </div>
                  {usage_limit !== null && (
                    <div className="w-56">
                      <InputText
                        name="usage_limit"
                        onChange={e => setData('usage_limit', e.target.value)}
                        value={usage_limit}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="inline-flex">
                <Checkbox
                  checked={once_per_customer}
                  onChange={e => setData('once_per_customer', e.target.checked)}
                />
                <span className="px-3 text-sm">
                  Limit to one use per customer
                </span>
              </div>

            </Card>

            <Card>
              <Subheader text="Active dates" />

              <div className="flex flex-row space-x-4">
                <div className="flex-1">
                  <Label title="Start date" />

                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date) => setStartDate(date)}
                    startDate={startDate}
                    customInput={
                      <div className="w-full">
                        <InputText
                          name=""
                          onChange={() => {}}
                          value={format(startDate, 'd/M/yyyy')}
                        />
                      </div>
                    }
                  />
                </div>

                <div className="flex-1">
                  <Label title="Start time" />
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date) => setStartDate(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    customInput={
                      <div className="w-full">
                        <InputText
                          name=""
                          onChange={() => {}}
                          value={format(startDate, 'h:mm aa')}
                        />
                      </div>
                    }
                  />
                </div>
              </div>

              <div className="flex flex-row space-x-4">
                <div className="flex-1">
                  <Label title="End date" />
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date) => setEndDate(date)}
                    startDate={endDate}
                    customInput={
                      <div className="w-full">
                        <InputText
                          name=""
                          onChange={() => {}}
                          value={format(endDate, 'd/M/yyyy')}
                        />
                      </div>
                    }
                  />
                </div>

                <div className="flex-1">
                  <Label title="End time" />
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date) => setEndDate(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    customInput={
                      <div className="w-full">
                        <InputText
                          name=""
                          onChange={() => {}}
                          value={format(endDate, 'h:mm aa')}
                        />
                      </div>
                    }
                  />
                </div>

              </div>
            </Card>
          </section>
        </div>
      </div>
    </Main>
  );
}
