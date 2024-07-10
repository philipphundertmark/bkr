import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Socket, io } from 'socket.io-client';

import { LiveEvent, LiveEventUtils } from '@bkr/api-interface';

export const LIVE_ENDPOINT = new InjectionToken<string>('LIVE_ENDPOINT');

@Injectable({
  providedIn: 'root',
})
export class LiveService implements OnDestroy {
  private readonly events$ = new Subject<LiveEvent>();
  private readonly socket: Socket;

  constructor(@Inject(LIVE_ENDPOINT) endpoint: string) {
    this.socket = io(endpoint);

    this.socket.on('event', (data: string): void => {
      const parsedData = LiveEventUtils.deserialize(data);
      this.events$.next(parsedData);
    });
  }

  /**
   * @implements {OnDestroy}
   */
  ngOnDestroy(): void {
    this.socket.close();
  }

  listen(): Observable<LiveEvent> {
    return this.events$.asObservable();
  }
}
