import React, { useState } from 'react'
import Main from '../Main'
import PageHeader from '../components/PageHeader'
import FormSubmitBar from '../components/FormSubmitBar'
import { useForm } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import route from 'ziggy-js'
import Subheader from '../components/Subheader'
import Card from '../components/Card'
import Border from '../components/Border'
import BackButton from '../components/BackButton'
import Label from '../components/forms/Label'
import InputText from '../components/forms/InputText'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'

interface Props {
  discount_type: 'code' | 'automatic';
}

export default function DiscountCreate({discount_type}: Props) {
  const {data, setData, isDirty} = useForm({});

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const handleSubmit = () => {
    const url = route('lshopify.collections.store');
    Inertia.post(url, data, {
      onSuccess: () => {
        Inertia.reload();
      },
    });
  };

  // return (
  //   <DatePicker selected={startDate} onChange={(date:Date) => setStartDate(date)} />
  // )

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
          <PageHeader text={`Create ${discount_type} discount`} />
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 space-y-6 lg:col-span-2 lg:col-start-1">
            <Card>
              <Subheader
                headerStyle="first-letter:capitalize"
                text={`${discount_type} discount`}
              />

              <div>
                <Label title="Title" />
                <InputText
                  name="title"
                  placeholder={'e.g. Ramadan promotion'}
                  onChange={e => {}}
                  value={''}
                />
                <p className="block py-1 text-sm text-gray-500">
                  Customers will see this in cart and at checkout.
                </p>
              </div>
            </Card>

            <Card>
              <Subheader text="Types" />

              <div className="flex flex-col space-y-2 text-sm">
                <div className="inline-flex items-center">
                  <input
                    type="radio"
                    value="manual"
                    name="type"
                    checked={false}
                    onChange={() => {}}
                  />
                  <div className="ml-3">Percentage</div>
                </div>
                <div className="inline-flex items-center">
                  <input
                    type="radio"
                    value="smart"
                    name="type"
                    checked={true}
                    onChange={() => {}}
                  />
                  <div className="ml-3">Fixed amount</div>
                </div>
              </div>
            </Card>

            <Card>
              <Subheader text="Value" />

              <div>
                <Label title="Discount value" />
                <div className="w-48">
                  <InputText
                    name="title"
                    placeholder={''}
                    onChange={e => {}}
                    value={''}
                    inputStyle=""
                    rightComponent={
                      <span className="text-sm text-gray-400">%</span>
                    }
                  />
                </div>
              </div>

              <Border />

              <Subheader headerStyle={'text-xs'} text={'APPLIES TO'} />
              <div className="flex flex-col space-y-2 text-sm">
                <div className="inline-flex items-center">
                  <input
                    type="radio"
                    value="manual"
                    name="type"
                    checked={false}
                    onChange={() => {}}
                  />
                  <div className="ml-3">All products</div>
                </div>
                <div className="inline-flex items-center">
                  <input
                    type="radio"
                    value="smart"
                    name="type"
                    checked={true}
                    onChange={() => {}}
                  />
                  <div className="ml-3">Specific collections</div>
                </div>
                <div className="inline-flex items-center">
                  <input
                    type="radio"
                    value="smart"
                    name="type"
                    checked={true}
                    onChange={() => {}}
                  />
                  <div className="ml-3">Specific products</div>
                </div>
              </div>
            </Card>

            <Card>
              <Subheader text="Minimum requirements" />

              <div className="relative flex items-start text-sm">
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    value="manual"
                    name="type"
                    checked={true}
                    onChange={() => {}}
                  />
                </div>
                <div className="ml-3">
                  <div>Minimum purchase amount (OMR)</div>
                  <div className="w-48">
                    <InputText
                      name="title"
                      placeholder={''}
                      onChange={e => {}}
                      value={''}
                      inputStyle=""
                      rightComponent={
                        <span className="text-sm text-gray-400">%</span>
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="relative flex items-start text-sm">
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    value="manual"
                    name="type"
                    checked={true}
                    onChange={() => {}}
                  />
                </div>
                <div className="ml-3">
                  <div>Minimum quantity of items</div>
                  <div className="w-48">
                    <InputText
                      name="title"
                      placeholder={''}
                      onChange={e => {}}
                      value={''}
                      inputStyle=""
                      rightComponent={
                        <span className="text-sm text-gray-400">%</span>
                      }
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <Subheader text="Active dates" />

              <div className="flex flex-row space-x-4">
                <div className="flex-1">
                  <Label title={'Start date'} />

                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date) => setStartDate(date)}
                    startDate={startDate}
                    customInput={
                      <div className='w-full'><InputText name='' onChange={()=>{}} value={format(startDate,'d/M/yyyy')}/></div>
                    }
                  />
                </div>

                <div className='flex-1'>
                  <Label title={'Start time'} />
                  <DatePicker
                    selected={startDate}
                    onChange={(date:Date) => setStartDate(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    customInput={
                      <div className='w-full'><InputText name='' onChange={()=>{}} value={format(startDate,'h:mm aa')}/></div>
                    }
                  />
                </div>

              </div>

              <div className="flex flex-row space-x-4">
                <div className="flex-1">
                  <Label title={'End date'} />
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date) => setEndDate(date)}
                    startDate={endDate}
                    customInput={
                      <div className='w-full'><InputText name='' onChange={()=>{}} value={format(endDate,'d/M/yyyy')}/></div>
                    }
                  />
                </div>

                <div className='flex-1'>
                  <Label title={'End time'} />
                  <DatePicker
                    selected={endDate}
                    onChange={(date:Date) => setEndDate(date)}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="h:mm aa"
                    customInput={
                      <div className='w-full'><InputText name='' onChange={()=>{}} value={format(endDate,'h:mm aa')}/></div>
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
