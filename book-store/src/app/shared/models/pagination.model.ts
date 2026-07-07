export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PagedResult<T> {
  data: T[];
  meta: PaginationMeta;
}
