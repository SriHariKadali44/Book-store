import { BookFormat } from './book.model';

export type CatalogSortBy =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'newest';

export interface CatalogFilters {
  query?: string;
  categoryId?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  format?: BookFormat[];
  sortBy?: CatalogSortBy;
  page: number;
  pageSize: number;
}

/** Default values used when no filters are active. */
export const DEFAULT_CATALOG_FILTERS: CatalogFilters = {
  page: 1,
  pageSize: 12,
  sortBy: 'relevance',
};
