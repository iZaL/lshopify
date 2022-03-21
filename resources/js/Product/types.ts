import {ProductStatus, Vendor} from '../types';

export type TabAttributes = 'all' | ProductStatus;

export interface SearchAttributes {
  search_term: string;
  collection_term: string;
  selected_categories: string[];
  tag_term: string;
  selected_collections: number[];
  selected_vendors: string[];
  selected_status: TabAttributes[];
  selected_view: TabAttributes;
}
