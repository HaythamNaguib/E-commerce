import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly httpClient = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private getHeaders(): HttpHeaders {
    const token = isPlatformBrowser(this.platformId)
      ? (localStorage.getItem('token') ?? '')
      : '';
    return new HttpHeaders({ token });
  }

  getCart(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'cart', {
      headers: this.getHeaders()
    });
  }

  addToCart(productId: string): Observable<any> {
    return this.httpClient.post(environment.baseUrl + 'cart',
      { productId },
      { headers: this.getHeaders() }
    );
  }

  updateCartItemCount(productId: string, count: number): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `cart/${productId}`,
      { count },
      { headers: this.getHeaders() }
    );
  }

  removeCartItem(productId: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `cart/${productId}`, {
      headers: this.getHeaders()
    });
  }

  clearCart(): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + 'cart', {
      headers: this.getHeaders()
    });
  }
}
