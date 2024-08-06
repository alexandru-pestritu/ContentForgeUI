import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();
    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !req.url.includes('token/refresh')) {
          return this.authService.refreshTokenRequest().pipe(
            switchMap(() => {
              const newToken = this.authService.getAccessToken();
              if (newToken) {
                const newAuthReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next.handle(newAuthReq);
              }
              return throwError(error);
            }),
            catchError(err => {
              this.authService.logout();
              this.router.navigate(['/login']);
              return throwError(err);
            })
          );
        }
        return throwError(error);
      })
    );
  }
}
