import {Product} from "./product.model";

export interface ProductsResponse {
  total: number;
  products: Product[];
}
