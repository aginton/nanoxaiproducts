import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import {Product} from "../model/product.model";
import {SearchProductsRequest} from "../model/search-product-request.model";
import {ProductsResponse} from "../model/products-response.model";


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiBaseUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) { }

  searchProducts(request: SearchProductsRequest): Observable<ProductsResponse> {
    console.log("Sending following searchRequest: ", request);
    return this.http.post<ProductsResponse>(this.apiBaseUrl, request);
  }

  getProduct(productId: number): Observable<any> {
    console.log("Going to try to get product using the following id: ", productId);
    const url = `${this.apiBaseUrl}/${productId}`;
    return this.http.get<any>(url);
  }

  createProduct(request: any) {
    console.log("Going to try to create using the following request: ", request);
    const url = `${this.apiBaseUrl}/create`;
    return this.http.post<ProductsResponse>(url, request);
  }

  updateProduct(request: any) {
    console.log("Going to try to update using the following request: ", request);
    const url = `${this.apiBaseUrl}/update`;
    return this.http.post<ProductsResponse>(url, request);
  }

  deleteProduct(productId: number) {
    console.log("Going to try to delete product with id: ", productId);
    const url = `${this.apiBaseUrl}/${productId}`;
    return this.http.delete(url);
  }

  deleteProducts(ids: number[]) {
    console.log("Going to try to delete product with ids: ", ids);
    const url = `${this.apiBaseUrl}?ids=${ids.join(',')}`;
    return this.http.delete<void>(url);
  }
}
