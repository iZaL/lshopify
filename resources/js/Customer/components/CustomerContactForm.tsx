import React, {ReactElement, useState} from 'react';

import InputText from '../../components/forms/InputText';
import Label from '../../components/forms/Label';

interface Props {
  email: string;
  phone: string;
  children: (attributes: {email: string; phone: string}) => ReactElement;
}

export default function CustomerContactForm({email, phone, children}: Props) {
  const [data, setData] = useState({email, phone});

  const onChange = (field: 'email' | 'phone', value: any) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  return (
    <>
      <div className="p-5">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <Label title="Email address" />
            <InputText
              name="contact_email"
              type="email"
              value={data.email}
              onChange={e => onChange('email', e.target.value)}
            />
          </div>

          <div className="sm:col-span-6">
            <Label title="Phone" />
            <InputText
              name="contact_phone"
              value={data.phone}
              onChange={e => onChange('phone', e.target.value)}
            />
          </div>
        </div>
      </div>
      {children(data)}
    </>
  );
}
