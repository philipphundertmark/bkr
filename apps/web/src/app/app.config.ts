import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';

import { appRoutes } from './app.routes';
import { AuthHttpInterceptorFn } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([AuthHttpInterceptorFn])),
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withEnabledBlockingInitialNavigation()
    ),
  ],
};
