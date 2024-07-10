import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { LiveEvent, LiveEventUtils } from '@bkr/api-interface';

@Injectable({
  providedIn: 'root',
})
export class LiveService {
  private readonly events$ = new Subject<LiveEvent>();

  constructor() {
    const live = new EventSource('http://localhost:3333/live');

    live.onmessage = (event): void => {
      const parsedData = LiveEventUtils.deserialize(event.data);
      this.events$.next(parsedData);
    };
  }

  listen(): Observable<LiveEvent> {
    return this.events$.asObservable();
  }
}
