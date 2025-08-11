import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product.model';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private BASE_URL = 'http://localhost:8000/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.BASE_URL);
  }
  getProductById(productId: string): Observable<any> {
    return this.http.get(`${this.BASE_URL}/${productId}`, {});
  }

  createProduct(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(`${this.BASE_URL}`, data, { headers });
  }

  likeProduct(productId: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/${productId}/like`, {});
  }

  unlikeProduct(productId: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}/${productId}/unlike`, {});
  }

  updateProduct(id: string, productData: FormData) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.put(`${this.BASE_URL}/${id}`, productData, { headers });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<{ categories: string[] }>(`${this.BASE_URL}/category`)
      .pipe(map(res => res.categories));
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${productId}`, {});
  }

  addComment(productId: string, comment: string) {
    return this.http.post<{ message: string, comment: any }>(
      `${this.BASE_URL}/${productId}/comment`, 
      { comment }
    );
  }



}
