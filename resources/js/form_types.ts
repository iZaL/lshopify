import {Billing, Shipping} from './types';

export interface OrderForm {
  contact_email: string;
  contact_phone: string;
  update_profile: boolean;

  shipping: Shipping;
  billing: Billing;
}

export interface CustomerForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  accepts_marketing: boolean;
  tax_exempted: boolean;
}
