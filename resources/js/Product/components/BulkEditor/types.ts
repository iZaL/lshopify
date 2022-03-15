import {Product, Variant} from '../../../types';

export type Attributes = {
  [name in keyof Product | keyof Variant]: string;
};

export type AttributeLabel = Partial<Attributes>;

export type ProductAttributes = 'title' | 'status' | 'tags'  | 'seo_title' | 'seo_description' | 'seo_url';
export type VariantAttributes =
  | 'price'
  | 'compare_at_price'
  | 'cost_price'
  | 'sku'
  | 'barcode'
  | 'weight'
  | 'quantity'
  | 'requires_shipping'
  | 'taxable'
  | 'hs_code'
  | 'track_quantity'
  | 'out_of_stock_sale'
  | 'origin_country_id'

  ;
