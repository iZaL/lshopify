import {ProductStatus, Vendor} from '../types';

export type TabAttributes = 'all' | ProductStatus;

export interface SearchAttributes {
  search_term: string;
  selected_status: TabAttributes[];
  selected_vendors: string[];
  selected_view: TabAttributes;
}
