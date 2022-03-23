import {ProductStatus} from '../types';

export type TabAttributes = 'all' | ProductStatus;

export interface SearchAttributes {
  product_search: string;
  collection_search: string;
  tag_search: string;
  selected_collections: number[];
  selected_categories: string[];
  selected_vendors: string[];
  selected_status: TabAttributes[];
  selected_view: TabAttributes;
}
