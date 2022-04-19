import React, {useState} from 'react';
import Modal from '../../components/Modal';
import ModalFooter from '../../components/ModalFooter';
import Subheader from '../../components/Subheader';
import CustomerContactForm from './CustomerContactForm';

interface Props {
  email: string;
  phone: string;
  onSave: (attributes: {contact_email: string; contact_phone: string}) => void;
}

export default function ContactCard({email, phone, onSave}: Props) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="">
      <div className="flex flex-row items-center justify-between">
        <Subheader text="CONTACT INFORMATION" headerStyle="text-xs" />
        <div
          className="cursor-pointer text-sm text-blue-500 hover:underline"
          onClick={() => setShowDialog(true)}>
          Edit
        </div>
      </div>

      <div className="text-sm text-blue-500">
        <div>{email}</div>
        <div className={`${!phone ?? 'text-gray-500'}`}>
          {phone ?? 'No number'}
        </div>
      </div>

      <Modal
        width="max-w-2xl"
        visible={showDialog}
        onClose={() => setShowDialog(false)}
        heading="Create a new customer"
        onConfirm={() => {}}
        submitButtonTitle="Done"
        hideFooter={true}>
        <CustomerContactForm email={email} phone={phone}>
          {attributes => (
            <ModalFooter
              onHideModal={() => setShowDialog(false)}
              onProceed={() => {
                setShowDialog(false);
                onSave({
                  contact_email: attributes.email,
                  contact_phone: attributes.phone,
                });
              }}
            />
          )}
        </CustomerContactForm>
      </Modal>
    </div>
  );
}
