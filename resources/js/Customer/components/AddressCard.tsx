import React, {useState} from 'react';
import Modal from '../../components/Modal';
import ModalFooter from '../../components/ModalFooter';
import Subheader from '../../components/Subheader';
import {Billing, CustomerAddress, Shipping} from '../../types';
import AddressForm from './AddressForm';

interface Props {
  address: Shipping | Billing;
  onSave: (address: CustomerAddress) => void;
  title: string;
}

export default function AddressCard({address, onSave, title}: Props) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="">
      <div className="flex flex-row items-center justify-between">
        <Subheader text={title} headerStyle="text-xs" />
        <div
          className="cursor-pointer text-sm text-blue-500 hover:underline"
          onClick={() => setShowDialog(true)}>
          Edit
        </div>
      </div>

      <div className="mt-2 text-sm ">
        <div>{`${address.first_name} ${address.last_name}`}</div>
        <div>{address.company}</div>
        <div>{address.address1}</div>
        <div>{address.address2}</div>
        <div>{address.city}</div>
        <div>{address.zip}</div>
        <div>{address.country}</div>
        <div>{address.phone}</div>
      </div>

      <Modal
        visible={showDialog}
        width="max-w-2xl"
        heading={`EDIT ${title}`}
        submitButtonTitle="Done"
        hideFooter={true}
        onClose={() => setShowDialog(false)}
        onConfirm={() => setShowDialog(false)}>
        <AddressForm address={address}>
          {attributes => {
            return (
              <ModalFooter
                onProceed={() => {
                  setShowDialog(false);
                  onSave(attributes);
                }}
                onHideModal={() => setShowDialog(false)}
              />
            );
          }}
        </AddressForm>
      </Modal>
    </div>
  );
}
