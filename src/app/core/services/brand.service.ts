import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private readonly httpClient = inject(HttpClient);

  getAllBrands(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'brands');
  }

  getBrandProducts(brandId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `products?brand=${brandId}`);
  }
}
