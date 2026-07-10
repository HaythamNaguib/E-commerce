import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly httpClient = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private cartCount$ = new BehaviorSubject<number>(0);

  get cartCount(): Observable<number> {
    return this.cartCount$.asObservable();
  }

  get cartCountValue(): number {
    return this.cartCount$.value;
  }

  private getHeaders(): HttpHeaders {
    const token = isPlatformBrowser(this.platformId)
      ? (localStorage.getItem('token') ?? '')
      : '';
    return new HttpHeaders({ token });
  }

  refreshCartCount(): void {
    this.getCart().subscribe({
      next: (res: any) => {
        const count = res.data?.products?.length ?? 0;
        this.cartCount$.next(count);
      },
      error: () => this.cartCount$.next(0)
    });
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
    ).pipe(
      tap(() => this.refreshCartCount())
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
    }).pipe(
      tap(() => this.refreshCartCount())
    );
  }

  clearCart(): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + 'cart', {
      headers: this.getHeaders()
    }).pipe(
      tap(() => this.cartCount$.next(0))
    );
  }
}
