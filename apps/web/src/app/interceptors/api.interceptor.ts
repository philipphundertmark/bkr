import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export const ApiHttpInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const endpoint = req.url;

  // Only prepend base URL to absolute paths
  if (!endpoint.startsWith('/')) {
    return next(req);
  }

  let baseUrl = environment.apiUrl + environment.apiPath;

  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  const fullUrl = baseUrl + endpoint;
  const modifiedRequest = req.clone({ url: fullUrl, withCredentials: true });

  return next(modifiedRequest);
};
