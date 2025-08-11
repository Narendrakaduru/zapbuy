// src/app/services/cart.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cart } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private baseUrl = 'http://localhost:8000/api/cart';

  // BehaviorSubject to store cart items locally
  private cartItemsSubject = new BehaviorSubject<Cart | null>(null);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /** Load cart from server and update BehaviorSubject */
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.baseUrl).pipe(
      tap(cart => this.cartItemsSubject.next(cart))
    );
  }

  /** Add item and update BehaviorSubject */
  addToCart(item: { productId: string; quantity: number }): Observable<Cart> {
    return this.http.post<Cart>(this.baseUrl, item).pipe(
      tap(cart => this.cartItemsSubject.next(cart))
    );
  }

  /** Update quantity and BehaviorSubject */
  updateQuantity(productId: string, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(this.baseUrl, { productId, quantity }).pipe(
      tap(cart => this.cartItemsSubject.next(cart))
    );
  }

  /** Remove item and update BehaviorSubject */
  removeItem(productId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.baseUrl}/${productId}`).pipe(
      tap(cart => this.cartItemsSubject.next(cart))
    );
  }

  /** Clear cart and update BehaviorSubject */
  clearCart(): Observable<Cart> {
    return this.http.delete<Cart>(this.baseUrl).pipe(
      tap(cart => this.cartItemsSubject.next(cart))
    );
  }
}
