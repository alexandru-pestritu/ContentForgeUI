import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError, timer } from 'rxjs';
import { HttpService } from '../http/http.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject: BehaviorSubject<boolean>;

  constructor(
    private httpService: HttpService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.isLoggedInSubject = new BehaviorSubject<boolean>(this.hasValidToken());
    this.setupTokenRefresh();
  }

  login(username: string, password: string): Observable<void> {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.httpService.post<any>('login', body.toString(), headers).pipe(
      tap(response => {
        this.localStorageService.setItem('access_token', response.access_token);
        this.localStorageService.setItem('refresh_token', response.refresh_token);
        this.isLoggedInSubject.next(true);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.localStorageService.removeItem('access_token');
    this.localStorageService.removeItem('refresh_token');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  refreshTokenRequest(): Observable<any> {
    const refreshToken = this.localStorageService.getItem('refresh_token');
    if (!refreshToken) {
      this.logout();
      return throwError('No refresh token available');
    }
    const url = `token/refresh?refresh_token=${refreshToken}`;

    return this.httpService.post<any>(url, {}).pipe(
      tap(response => {
        this.localStorageService.setItem('access_token', response.access_token);
        this.localStorageService.setItem('refresh_token', response.refresh_token);
        this.isLoggedInSubject.next(true);
      }),
      catchError(error => {
        if (error.status === 401) {
          this.logout();
        }
        return throwError(error);
      })
    );
}

  getAccessToken(): string | null {
    return this.localStorageService.getItem('access_token');
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  private hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return exp > Date.now() / 1000;
    } catch (e) {
      return false;
    }
  }

  private setupTokenRefresh(): void {
    const token = this.getAccessToken();
    if (token) {
      const { exp } = jwtDecode<{ exp: number }>(token);
      const expiresInMs = (exp * 1000) - Date.now();
      const refreshTime = expiresInMs - (1 * 60 * 1000);

      if (refreshTime > 0) {
        timer(refreshTime).pipe(
          switchMap(() => this.refreshTokenRequest())
        ).subscribe({
          next: () => this.setupTokenRefresh(), 
          error: () => this.logout()
        });
      } else {
        this.logout(); 
      }
    }
  }

  private handleError(error: any): Observable<never> {
    return throwError(error);
  }
}
