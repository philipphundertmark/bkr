import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, Subject } from 'rxjs';
import { Socket, io } from 'socket.io-client';

import { LiveEvent, LiveEventUtils } from '@bkr/api-interface';

export const LIVE_HOST = new InjectionToken<string>('LIVE_HOST');
export const LIVE_PATH = new InjectionToken<string>('LIVE_PATH');

@Injectable({
  providedIn: 'root',
})
export class LiveService implements OnDestroy {
  private readonly connected$ = new Subject<boolean>();
  private readonly events$ = new Subject<LiveEvent>();

  private readonly socket: Socket;

  connected = toSignal(this.connected$);

  constructor(
    @Inject(LIVE_HOST) host: string,
    @Inject(LIVE_PATH) path: string,
  ) {
    this.socket = io(host, { path });

    this.socket.on('connect', () => {
      this.connected$.next(true);
    });

    this.socket.on('disconnect', () => {
      this.connected$.next(false);
    });

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
