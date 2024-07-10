import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Socket, io } from 'socket.io-client';

import { LiveEvent, LiveEventUtils } from '@bkr/api-interface';

export const LIVE_HOST = new InjectionToken<string>('LIVE_HOST');
export const LIVE_PATH = new InjectionToken<string>('LIVE_PATH');

@Injectable({
  providedIn: 'root',
})
export class LiveService implements OnDestroy {
  private readonly events$ = new Subject<LiveEvent>();
  private readonly socket: Socket;

  constructor(
    @Inject(LIVE_HOST) host: string,
    @Inject(LIVE_PATH) path: string,
  ) {
    console.log('Connect to', host, path);
    this.socket = io({ host, path });

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
