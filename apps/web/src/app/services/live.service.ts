import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { LiveEvent, LiveEventUtils } from '@bkr/api-interface';

export const LIVE_ENDPOINT = new InjectionToken<string>('LIVE_ENDPOINT');

@Injectable({
  providedIn: 'root',
})
export class LiveService implements OnDestroy {
  private readonly events$ = new Subject<LiveEvent>();
  private readonly source: EventSource;

  constructor(@Inject(LIVE_ENDPOINT) endpoint: string) {
    this.source = new EventSource(endpoint);

    this.source.onmessage = (event): void => {
      const parsedData = LiveEventUtils.deserialize(event.data);
      this.events$.next(parsedData);
    };
  }

  /**
   * @implements {OnDestroy}
   */
  ngOnDestroy(): void {
    this.source.close();
  }

  listen(): Observable<LiveEvent> {
    return this.events$.asObservable();
  }
}
