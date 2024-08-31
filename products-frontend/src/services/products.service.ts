import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  thumbnail: string;
  // other fields...
}

export interface ProductsResponse {
  total: number;
  products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) { }

  getProducts(fulldata: boolean): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}?fulldata=${fulldata}`);
  }
}
