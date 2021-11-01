import {OrderForm, CustomerForm} from './form_types';

export interface Tag {
  id: string;
  name: string;
}

export interface ProductType {
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
  | 'product_type'
  | 'product_vendor';

export interface CollectionCondition {
  id: number;
  field: CollectionField;
  criteria: string;
  value: string;
}

export interface Collection {
  id: number;
  name: string;
  description: string;
  type: CollectionType;
  determiner: CollectionDeterminer;
  conditions: Array<CollectionCondition>;
  products?: Array<Product>;
}

export interface Image extends File {
  id: number;
  url: string;
}

export interface VariantOption {
  id: string;
  name: string;
  options?: Array<{id: string; name: string}>;
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
  track_quantity: boolean;
  requires_shipping: boolean;
  physical_product: boolean;
  options: VariantOption[];
  product?: Product;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archive';
  product_type: ProductType | null;
  default_variant: Variant;
  variants?: Variant[];
  tags?: Tag[];
  images?: Image[];
  image?: Image;
  collections?: Collection[];
}

export interface VariantPivot extends Variant {
  pivot_id: number;
  pivot_quantity: number;
  pivot_price: string;
  pivot_subtotal: string;
  pivot_total: string;
}

export interface Order extends OrderForm {
  id: number;
  total: string;
  subtotal: string;
  quantity: number;
  shipping_full_name: string;
  shipping_last_name: string;
  variants: VariantPivot[];
  returns: VariantPivot[];
  customer?: Customer;
  pending_fulfillments: Fulfillment[];
  success_fulfillments: Fulfillment[];
  fulfillments:Fulfillment[];
  payments: Payment[];
  is_payment_pending: boolean;
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
  discount: CartDiscount;
}

export interface Cart {
  total: string;
  subtotal: string;
  discount_value: string;
  discount: CartDiscount;
  items: {
    [x: string]: CartItem;
  };
}

export interface CartDiscount {
  name?: string;
  type?: string;
  target?: string;
  suffix?: string;
  value?: string;
  reason?: string;
}

export interface Customer extends CustomerForm {
  id: number;
  readonly full_name: string;
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

export interface Shipping extends CustomerAddress {}

export interface Billing extends CustomerAddress {}

export interface Fulfillment {
  id: number;
  variants: VariantPivot[];
}

export interface FulfillmentVariant extends VariantPivot {

}
