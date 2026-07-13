import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  // injecion httpclient
  private readonly httpcliene = inject(HttpClient)
  getAllProducts(PageNumbuer: number = 1): Observable<any> {
    return this.httpcliene.get(environment.baseUrl + `products?page=${PageNumbuer}`);

  }

}
