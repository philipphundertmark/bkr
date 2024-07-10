import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { LiveEvent, LiveEventUtils } from '@bkr/api-interface';

export const LIVE_ENDPOINT = new InjectionToken<string>('LIVE_ENDPOINT');

@Injectable({
  providedIn: 'root',
})
export class LiveService {
  private readonly events$ = new Subject<LiveEvent>();

  constructor(@Inject(LIVE_ENDPOINT) endpoint: string) {
    const live = new EventSource(endpoint);

    live.onmessage = (event): void => {
      const parsedData = LiveEventUtils.deserialize(event.data);
      this.events$.next(parsedData);
    };
  }

  listen(): Observable<LiveEvent> {
    return this.events$.asObservable();
  }
}
