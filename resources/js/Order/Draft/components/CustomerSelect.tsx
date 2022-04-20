import {PlusCircleIcon, SearchIcon} from '@heroicons/react/solid';
import React, {useState} from 'react';

import Border from '../../../components/Border';
import Card from '../../../components/Card';
import Dropdown from '../../../components/Dropdown';
import InputText from '../../../components/forms/InputText';
import Modal from '../../../components/Modal';
import ModalFooter from '../../../components/ModalFooter';
import Subheader from '../../../components/Subheader';
import CreateCustomerForm from '../../../Customer/components/CreateCustomerForm';
import {CustomerForm} from '../../../form_types';
import {Customer, CustomerAddress} from '../../../types';

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

  const onCustomerSave = (
    customerData: CustomerForm,
    addressData: CustomerAddress,
  ) => {
    onCustomerCreate(customerData, addressData);
  };

  return (
    <Card>
      <Subheader text="Find or create a customer" />

      <div className="w-100 relative" onClick={() => setShowMenu(true)}>
        <InputText
          name="search"
          placeholder="Search customer"
          onChange={e => {
            setSearchTerm(e.target.value);
          }}
          value=""
          leftComponent={<SearchIcon className="h-5 w-5 text-gray-500" />}
          autocomplete="off"
        />

        <Dropdown
          visible={showMenu}
          setVisible={visible => setShowMenu(visible)}>
          <div className="bg-white">
            <div className="p-2">
              <div
                className="flex cursor-pointer flex-row items-center space-x-2 rounded-md px-5 py-2 text-sm text-gray-800 hover:bg-gray-100"
                onClick={() => setShowDialog('create_customer')}>
                <PlusCircleIcon className="h-5 w-5 text-gray-500" />
                <div>Create new customer</div>
              </div>
            </div>

            <Border borderStyle="my-0" />

            <ul className="p-2">
              {customers.map((customer, i) => (
                <li
                  key={i}
                  className="cursor-pointer space-x-2 rounded-md px-5 py-2 text-sm text-gray-800 hover:bg-gray-100"
                  onClick={() => onCustomerSelect(customer)}>
                  {customer.full_name}
                </li>
              ))}
            </ul>
          </div>
        </Dropdown>
      </div>

      <Modal
        width="max-w-2xl"
        visible={showDialog === 'create_customer'}
        onClose={() => setShowDialog(null)}
        heading="Create a new customer"
        onConfirm={() => {}}
        submitButtonTitle="Save customer"
        hideFooter>
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
