import {ReactNode} from 'react';

// import { CartDiscount } from '../../../vendor/izal/lshopify/resources/js/types'

import {CustomerForm, OrderForm} from './form_types';

export interface Tag {
  id: string;
  name: string;
}

export interface Vendor {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Payment {
  id: number;
  amount: string;
  total: string;
  subtotal: string;
}

export type CollectionType = 'manual' | 'smart';
export type CollectionDeterminer = 'all' | 'any';
export type CollectionField =
  | 'product_title'
  | 'product_category'
  | 'product_vendor';

export interface CollectionCondition {
  id: number;
  field: CollectionField;
  criteria: string;
  value: string;
  title?: string;
}

export interface Collection {
  id: number;
  name: string;
  description: string;
  type: CollectionType;
  determiner: CollectionDeterminer;
  conditions: Array<CollectionCondition>;
  products?: Array<Product>;
  image?: Image | null;
}

export interface Image extends File {
  id: number;
  url: string;
}

export interface VariantValue {
  id: string;
  name: string;
}

export interface VariantOption {
  id: string;
  name: string;
  values?: VariantValue[];
}

export interface Variant {
  id: number;
  title?: string;
  price: string;
  compare_at_price: string;
  cost_price: string;
  quantity: string;
  sku: string;
  barcode: string;
  weight: string;
  hs_code: string;
  origin_country_id: string;
  image: Image | null;
  taxable: boolean;
  out_of_stock_sale: boolean;
  tracked: boolean;
  requires_shipping: boolean;
  physical_product: boolean;
  options: VariantOption[];
  product?: Product;
}

export type ProductStatus = 'active' | 'draft' | 'archived';
export type DiscountTargetType = 'all_products' | 'products' | 'collections';

export interface Product {
  id: number;
  title: string;
  description: string;
  status: ProductStatus;
  available_quantity: string;
  inventory_tracked?: string;
  variants_count?: string;
  category?: Category;
  vendor?: Vendor;
  default_variant: Variant;
  variants?: Variant[];
  tags?: Tag[];
  images?: Image[];
  image?: Image;
  collections?: Collection[];
  seo_title?: string;
  seo_description?: string;
  seo_url?: string;
}

export interface VariantPivot extends Variant {
  pivot_id: number;
  pivot_quantity: number;
  pivot_price: string;
  pivot_subtotal: string;
  pivot_total: string;
}

export interface Fulfillment {
  id: number;
  title: string;
  type: 'fulfilled' | 'returned' | 'refund' | 'removed';
  status: 'removed' | 'success' | 'pending' | 'failed' | 'cancelled';
  can_cancel: boolean;
  can_mark_as_returned: boolean;
  can_return: boolean;
  can_add_tracking: boolean;
  total_variants_count: string;
  variants: VariantPivot[];
  order?: Order;
}

export interface Order extends OrderForm {
  id: number;
  total: string;
  total_formatted: string;
  subtotal: string;
  quantity: number;
  shipping_full_name: string;
  shipping_last_name: string;
  variants: VariantPivot[];
  returns: VariantPivot[];
  customer?: Customer;
  pending_fulfillments: Fulfillment[];
  success_fulfillments: Fulfillment[];
  // fulfillments: Fulfillment[];
  workflows: Fulfillment[];
  payments: Payment[];
  is_payment_pending: boolean;
  date: string;
  date_time: string;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  items_count: string;
}

export interface CartItem {
  id: number;
  rowId: string;
  name: string;
  quantity: string;
  price: string;
  unit_price: string;
  total: string;
  subtotal: string;
  variant: Variant;
  discount: Discount;
  // discount: CartDiscount;
}

export interface Cart {
  total: string;
  subtotal: string;
  discount_value: string;
  // discount: CartDiscount;
  discount: Discount;
  items: {
    [x: string]: CartItem;
  };
}

// export interface CartDiscount {
//   name?: string;
//   type?: string;
//   target?: string;
//   suffix?: string;
//   value?: string;
//   reason?: string;
// }

export interface Customer extends CustomerForm {
  id: number;
  readonly full_name: string;
  readonly name: string;
  addresses?: CustomerAddress[];
}

export interface CustomerAddress {
  first_name: string;
  last_name: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
}

export type Shipping = CustomerAddress;

export type Billing = CustomerAddress;

export type FulfillmentVariant = VariantPivot;

export type ButtonTheme = 'success' | 'error' | 'warning' | 'default' | 'clear';

export interface ButtonProps {
  buttonStyle?: string;
  onClick?: () => void;
  theme?: ButtonTheme;
  border?: boolean;
  rounded?: boolean;
  children?: ReactNode;
  disabled?: boolean;
}

export interface Discount {
  id: number;
  name: string;
  // title: string | null;
  // code: string;
  type: 'code' | 'automatic';
  value: string;
  value_type: 'amount' | 'percent';
  target_type: DiscountTargetType;
  min_requirement_type: 'amount' | 'quantity' | null;
  min_requirement_value: string;
  once_per_customer: boolean;
  usage_limit: string | null;
  customers: Customer[];
  collections: Collection[];
  variants: Variant[];
  customer_selection: 'all' | 'custom' | 'none';
  starts_at: Date;
  ends_at: Date;
  reason: string;
}
