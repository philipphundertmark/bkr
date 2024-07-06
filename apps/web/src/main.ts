import { bootstrapApplication } from '@angular/platform-browser';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

declare global {
  interface Window {
    plausible: (
      event: string,
      options?: { props?: Record<string, unknown> },
    ) => void;
  }
}

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
