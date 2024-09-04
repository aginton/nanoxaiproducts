export interface SearchProductsRequest {
  text?: string;
  sortField?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  size?: number;
  allItems?: boolean;
}
