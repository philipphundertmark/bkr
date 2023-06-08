import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, switchMap, take, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';

export const AuthHttpInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const baseUrl = environment.apiUrl + environment.apiPath;
  const requestUrl = req.url;

  if (!requestUrl.startsWith(baseUrl)) {
    return next(req);
  }

  const authService = inject(AuthService);

  return authService.token$.pipe(
    take(1),
    switchMap((token: string | null) => {
      const modifiedRequest = token
        ? req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
          })
        : req;

      return next(modifiedRequest).pipe(
        tap((event: HttpEvent<unknown>) => {
          if (event instanceof HttpResponse && event.status === 401) {
            authService.logout();
          }
        })
      );
    })
  );
};
