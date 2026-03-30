import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly httpClient = inject(HttpClient);

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders({ token });
  }

  cashOrder(cartId: string, shippingAddress: object): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + `orders/${cartId}`,
      { shippingAddress },
      { headers: this.getHeaders() }
    );
  }

  onlineOrder(cartId: string, shippingAddress: object): Observable<any> {
    return this.httpClient.post(
      environment.baseUrl + `orders/checkout-session/${cartId}?url=${window.location.origin}`,
      { shippingAddress },
      { headers: this.getHeaders() }
    );
  }
}
