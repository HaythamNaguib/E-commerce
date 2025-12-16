import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient)
  registerForm(): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `auth/signup`, FormGroup)

  }

}
