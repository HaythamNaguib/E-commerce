import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  isLoggedIn = signal<boolean>(
    isPlatformBrowser(this.platformId)
      ? !!localStorage.getItem('token')
      : false
  );

  registerForm(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `auth/signup`, data);
  }

  loginForm(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `auth/signin`, data).pipe(
      tap((res: any) => {
        if (res.token && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', res.token);
          this.isLoggedIn.set(true);
        }
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }
}
