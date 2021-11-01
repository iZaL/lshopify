import React, {useState} from 'react';
import Card from '../../../components/Card';
import Subheader from '../../../components/Subheader';
import {PlusCircleIcon, SearchIcon} from '@heroicons/react/solid';
import InputText from '../../../components/forms/InputText';
import Dropdown from '../../../components/Dropdown';
import Border from '../../../components/Border';
import Modal from '../../../components/Modal';
import CreateCustomerForm from '../../../Customer/components/CreateCustomerForm';
import {Customer, CustomerAddress} from '../../../types';
import {CustomerForm} from '../../../form_types';
import ModalFooter from '../../../components/ModalFooter';

interface Props {
  searchTerm: string;
  setSearchTerm: (text: string) => void;
  customers: Customer[];
  onCustomerCreate: (customer: CustomerForm, address: CustomerAddress) => void;
  onCustomerSelect: (customer: Customer) => void;
}

export default function CustomerSelect({
  setSearchTerm,
  customers,
  onCustomerCreate,
  onCustomerSelect,
}: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDialog, setShowDialog] = useState<'create_customer' | null>(null);

  console.log('showCollectionMenu', showMenu);

  const onCustomerSave = (
    customerData: CustomerForm,
    addressData: CustomerAddress
  ) => {
    console.log('customerData', customerData);
    onCustomerCreate(customerData, addressData);
  };

  return (
    <Card>
      <Subheader text='Find or create a customer' />

      <div className='relative w-100' onClick={() => setShowMenu(true)}>
        <InputText
          name='search'
          placeholder={'Search products'}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          value=''
          leftComponent={<SearchIcon className='w-5 h-5 text-gray-500' />}
          autocomplete='off'
        />

        <Dropdown
          visible={showMenu}
          setVisible={(visible) => setShowMenu(visible)}
        >
          <div className='bg-white'>
            <div className='p-2'>
              <div
                className='flex flex-row items-center space-x-2 rounded-md px-5 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer'
                onClick={() => setShowDialog('create_customer')}
              >
                <PlusCircleIcon className='w-5 h-5 text-gray-500' />
                <div>Create new customer</div>
              </div>
            </div>

            <Border style='my-0' />

            <ul className='p-2'>
              {customers.map((customer, i) => (
                <li
                  key={i}
                  className='text-sm text-gray-800 space-x-2 rounded-md px-5 py-2 hover:bg-gray-100 cursor-pointer'
                  onClick={() => onCustomerSelect(customer)}
                >
                  {customer.full_name}
                </li>
              ))}
            </ul>
          </div>
        </Dropdown>
      </div>

      <Modal
        width='max-w-2xl'
        visible={showDialog === 'create_customer'}
        onClose={() => setShowDialog(null)}
        heading='Create a new customer'
        onConfirm={() => {}}
        submitButtonTitle='Save customer'
        hideFooter={true}
      >
        <CreateCustomerForm>
          {(customerData: CustomerForm, addressData: CustomerAddress) => (
            <ModalFooter
              onHideModal={() => setShowDialog(null)}
              onProceed={() => {
                setShowDialog(null);
                onCustomerSave(customerData, addressData);
              }}
            />
          )}
        </CreateCustomerForm>
      </Modal>
    </Card>
  );
}
