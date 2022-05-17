import {Inertia} from '@inertiajs/inertia';
import {useForm} from '@inertiajs/inertia-react';
import {format} from 'date-fns';
import React, {useEffect, useState} from 'react';
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
import ModalFooter from '../components/ModalFooter'
import ModalListSelection from '../components/ModalListSelection';
import PageHeader from '../components/PageHeader';
import Subheader from '../components/Subheader';
import Main from '../Main';
import VariantImage from '../Product/Variant/components/VariantImage'
import { Collection, Customer, Discount, Product, Variant } from '../types'

interface Props {
  discount: Discount;
  customers: {
    data: Customer[];
  };
  collections: {
    data: Collection[];
  };
  products: {
    data: Product[];
  };
}

export default function DiscountCreate(props: Props) {
  const {data, setData, isDirty} = useForm<Discount & {searchTerm: string}>({
    ...props.discount,
    searchTerm: '',
  });
  const {
    id,
    name,
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
    collections,
    variants,
    customer_selection,
    starts_at,
    ends_at,
    searchTerm,
  } = data;

  const [startDate, setStartDate] = useState(
    starts_at ? new Date(starts_at) : new Date(),
  );
  const [endDate, setEndDate] = useState(
    ends_at ? new Date(ends_at) : new Date(),
  );

  const isEdit = !!id;

  useEffect(() => {
    console.log('data changed', data);
  }, [data]);

  useEffect(() => {
    setData({
      ...data,
      starts_at: startDate,
      ends_at: endDate,
    });
  }, [startDate, endDate]);

  function generateDiscountCode() {
    setData({
      ...data,
      code: Math.random().toString(36).substring(2, 10).toUpperCase(),
    });
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
            : `only to selected ${target_type}`}
        </span>
      </div>
    );
  }

  const handleSubmit = () => {
    const url = isEdit
      ? route('lshopify.discounts.update', {id})
      : route('lshopify.discounts.store');
    Inertia.post(url, {
      ...data,
      customers: customers?.map(c => c.id),
      collections: collections?.map(c => c.id),
      variants: variants?.map(c => c.id),
      _method: isEdit ? 'PATCH' : 'POST',
    });
  };

  function onSearch(
    value: string,
    type: 'collections' | 'products' | 'customers' = 'collections',
  ) {
    setData({
      ...data,
      searchTerm: value,
    });

    Inertia.get(
      route('lshopify.discounts.create'),
      {
        collection_search: type === 'collections' ? value : '',
        product_search: type === 'products' ? value : '',
      },
      {
        preserveState: true,
      },
    );
  }

  function onCollectionConfirm(items: Collection[]) {
    setData({
      ...data,
      collections: items,
      searchTerm: '',
    });
  }

  function onVariantConfirm(items: number[]) {
    console.log('selected variants',items);
    const allVariants = props.products.data.map(p => p.variants).flat() as Variant[];
    console.log('all variants',allVariants);
    const vrnts = allVariants.filter(v => items.includes(v.id));
    setData({
      ...data,
      variants: vrnts,
      searchTerm: '',
    });
  }

  function onCustomersConfirm(items: Customer[]) {
    setData({
      ...data,
      customers: items,
      searchTerm: '',
    });
  }

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
          <PageHeader
            text={isEdit ? `Edit ${name}` : `Create ${type} discount`}
          />
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2 lg:col-start-1">
            <Card>
              {type === 'automatic' && (
                <>
                  <Subheader
                    headerStyle="first-letter:capitalize"
                    text="Automatic discount"
                  />
                  <div>
                    <Label title="Title" />
                    <InputText
                      name="title"
                      placeholder="e.g. Ramadan promotion"
                      onChange={e => setData('title', e.target.value)}
                      value={title}
                    />
                    <p className="block py-1 text-sm text-gray-500">
                      Customers will see this in cart and at checkout.
                    </p>
                  </div>
                </>
              )}
              {type === 'code' && (
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
              )}
            </Card>

            <Card>
              <Subheader text="Types" />
              <div className="flex flex-col space-y-2 text-sm">
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
                      <span className="text-sm text-gray-400">
                        {value_type === 'percentage' ? '%' : 'OMR'}
                      </span>
                    }
                  />
                </div>
              </div>

              <Border />

              <Subheader headerStyle="text-xs" text="APPLIES TO" />
              <div className="flex flex-col space-y-2 text-sm">
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

              {/*{target_type === 'collections' && (*/}
              {/*  <ModalListSelection*/}
              {/*    searchTerm={searchTerm}*/}
              {/*    items={props.collections.data || []}*/}
              {/*    selectedItems={collections || []}*/}
              {/*    onSearch={value => onSearch(value)}*/}
              {/*    onConfirm={items => onCollectionConfirm(items)}*/}
              {/*    placeholder="Search collections"*/}
              {/*    modalProps={{*/}
              {/*      title: 'Add collections',*/}
              {/*      onClose: () => {*/}
              {/*        setData({*/}
              {/*          ...data,*/}
              {/*          searchTerm: '',*/}
              {/*          collections: [],*/}
              {/*        });*/}
              {/*      },*/}
              {/*    }}*/}
              {/*  />*/}
              {/*)}*/}

              {target_type === 'products' && (
                <ModalListSelection
                  searchTerm={searchTerm}
                  items={props.products.data || []}
                  selectedItems={variants.map(({id}) => id) || []}
                  onSearch={value => onSearch(value, 'products')}
                  onConfirm={(items) => onVariantConfirm(items)}
                  // onItemsConfirm={items => onVariantConfirm(items)}
                  placeholder="Search products"
                  modalProps={{
                    title: 'Add products',
                    onClose: () => {
                      setData({
                        ...data,
                        searchTerm: '',
                        variants: [],
                      });
                    },
                    // hideFooter: true,
                  }}
                >
                  {({item,selectedItemIDs,addRemoveItem}: {item:Product,selectedItemIDs:number[],addRemoveItem:(item:any) => void}) => {
                    return (
                      <div key={item.id}>
                        <li
                          className="flex flex-row items-center space-x-4 border-b border-gray-200 py-2 px-4
              text-sm hover:bg-gray-100
              "
                          onClick={() =>
                            !item.variants?.length &&
                            addRemoveItem(item.default_variant)
                          }>
                          {!item.variants?.length && (
                            <Checkbox
                              checked={false}
                              name="product"
                              onChange={() => {}}
                            />
                          )}

                          <VariantImage
                            image={item.image}
                            onClick={() => {}}
                            imageStyle="w-12 h-12"
                          />
                          <div className="flex-auto">{item.title}</div>
                          {!item.variants?.length && (
                            <>
                              <div className="w-20">0 available</div>
                              <div className="w-20">OMR 10</div>
                            </>
                          )}
                        </li>
                        {item.variants?.map((variant, idx) => (
                          <li
                            className="flex flex-row items-center space-x-4 border-b border-gray-200 py-2 px-4 pl-11
              text-sm hover:bg-gray-100
              "
                            key={idx}
                            onClick={() => addRemoveItem(variant)}>
                            <Checkbox
                              checked={selectedItemIDs.includes(variant.id)}
                              name="variant"
                              onChange={() => {}}
                            />
                            <VariantImage
                              image={variant.image}
                              onClick={() => {}}
                              imageStyle="w-12 h-12"
                            />
                            <div className="flex-auto">{variant.title}</div>
                            <div className="w-20">{variant.quantity} available</div>
                            <div className="w-20">{variant.price}</div>
                          </li>
                        ))}
                      </div>
                    );
                  }}
                </ModalListSelection>
              )}
            </Card>

            <Card cardStyle="text-sm">
              <Subheader text="Minimum requirements" />

              <div className="">
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
                    <MinQuantityInput
                      show={min_requirement_type === 'amount'}
                    />
                  </div>
                </div>

                <div className="relative flex items-start pt-2">
                  <div className="flex h-5 items-center">
                    <Checkbox
                      type="radio"
                      checked={min_requirement_type === 'quantity'}
                      onChange={() =>
                        setData('min_requirement_type', 'quantity')
                      }
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
              <div className="">
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
                      onChange={() => setData('customer_selection', 'custom')}
                    />
                  </div>
                  <div className="ml-3">
                    <div>Specific customers</div>
                    {/* <MinQuantityInput show={min_requirement_type === 'amount'} /> */}
                  </div>
                </div>

                {/*{customer_selection === 'custom' && (*/}
                {/*  <ModalListSelection*/}
                {/*    searchTerm={searchTerm}*/}
                {/*    items={props.customers.data || []}*/}
                {/*    selectedItems={customers || []}*/}
                {/*    onSearch={value => onSearch(value, 'customers')}*/}
                {/*    onConfirm={items => onCustomersConfirm(items)}*/}
                {/*    placeholder="Search customers"*/}
                {/*    modalProps={{*/}
                {/*      title: 'Add customers',*/}
                {/*      onClose: () => {*/}
                {/*        setData({*/}
                {/*          ...data,*/}
                {/*          searchTerm: '',*/}
                {/*          customers: [],*/}
                {/*        });*/}
                {/*      },*/}
                {/*    }}*/}
                {/*  />*/}
                {/*)}*/}
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
