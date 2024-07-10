import { DialogModule } from '@angular/cdk/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  Router,
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import * as Sentry from '@sentry/angular';

import { environment } from '../environments/environment';
import { appRoutes } from './app.routes';
import { ApiHttpInterceptorFn } from './interceptors/api.interceptor';
import { AuthHttpInterceptorFn } from './interceptors/auth.interceptor';
import { LIVE_HOST, LIVE_PATH } from './services';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([DialogModule, OverlayModule]),
    {
      provide: LIVE_HOST,
      useValue: environment.apiUrl.startsWith('https')
        ? environment.apiUrl.replace('https', 'wss')
        : environment.apiUrl.replace('http', 'ws'),
    },
    {
      provide: LIVE_PATH,
      useValue: environment.apiPath + '/socket.io',
    },
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler({
        showDialog: true,
      }),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: () => () => {
        return;
      },
      deps: [Sentry.TraceService],
      multi: true,
    },
    provideAnimations(),
    provideHttpClient(
      withInterceptors([ApiHttpInterceptorFn, AuthHttpInterceptorFn]),
    ),
    provideRouter(
      appRoutes,
      withComponentInputBinding(),
      withEnabledBlockingInitialNavigation(),
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};
