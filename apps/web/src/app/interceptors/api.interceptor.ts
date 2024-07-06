import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export const ApiHttpInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  let baseUrl = environment.apiUrl + environment.apiPath;
  let endpoint = req.url;

  if (baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  if (endpoint.startsWith('/')) {
    endpoint = endpoint.slice(1);
  }

  const fullUrl = `${baseUrl}/${endpoint}`;
  const modifiedRequest = req.clone({ url: fullUrl });

  return next(modifiedRequest);
};
