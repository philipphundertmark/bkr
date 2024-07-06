import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  distinctUntilChanged,
  map,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';

import {
  Settings,
  SettingsDTO,
  SettingsUtils,
  UpdateSettingsSchema,
} from '@bkr/api-interface';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly _settings$ = new BehaviorSubject<Settings | null>(null);
  readonly settings$ = this._settings$.pipe(shareReplay(1));

  private readonly _loading$ = new BehaviorSubject<boolean>(true);
  readonly loading$ = this._loading$.pipe(distinctUntilChanged());

  private readonly _error$ = new BehaviorSubject<Error | null>(null);
  readonly error$ = this._error$.pipe(distinctUntilChanged());

  readonly publishResults$ = this.settings$.pipe(
    map((settings) => settings?.publishResults ?? false),
    distinctUntilChanged(),
  );

  constructor(private readonly http: HttpClient) {}

  getSettings(): Observable<Settings> {
    this._loading$.next(true);

    return this.http.get<SettingsDTO>('/settings').pipe(
      map(SettingsUtils.deserialize),
      tap((settings) => this._settings$.next(settings)),
      tap(() => this._loading$.next(false)),
      catchError((error: HttpErrorResponse) => {
        this._loading$.next(false);
        this._error$.next(error);

        return throwError(() => error);
      }),
    );
  }

  updateSettings(dto: UpdateSettingsSchema): Observable<Settings | null> {
    return this.http.put<SettingsDTO>('/settings', dto).pipe(
      map(SettingsUtils.deserialize),
      tap((settings) => this._settings$.next(settings)),
    );
  }
}
