import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import {
  BehaviorSubject,
  Observable,
  distinctUntilChanged,
  map,
  tap,
} from 'rxjs';

import { JwtPayload, Role } from '@bkr/api-interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _token$ = new BehaviorSubject<string | null>(null);
  readonly token$ = this._token$.pipe(distinctUntilChanged());

  /**
   * Observable that emits information about the current user.
   * Emits `null`, if no user is logged in.
   */
  readonly user$ = this.token$.pipe(
    map((token) => (token !== null ? jwtDecode<JwtPayload>(token) : null))
  );

  readonly role$ = this.user$.pipe(
    map((user) => (user !== null ? user.role : null))
  );

  readonly isAuthenticated$ = this.user$.pipe(
    map((user) => user !== null),
    distinctUntilChanged()
  );

  readonly isAdmin$ = this.user$.pipe(
    map((user) => user?.role === Role.ADMIN),
    distinctUntilChanged()
  );
  readonly isStation$ = this.user$.pipe(
    map((user) => user?.role === Role.STATION),
    distinctUntilChanged()
  );

  constructor(private readonly http: HttpClient) {}

  login(code: string): Observable<string> {
    return this.http
      .post<{ token: string }>('/token', {
        code: code,
      })
      .pipe(
        map((res) => res.token),
        tap((token) => this._token$.next(token)),
        tap((token) => localStorage.setItem('token', token))
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this._token$.next(null);
  }

  restore(): void {
    const token = localStorage.getItem('token');
    this._token$.next(token);
  }
}
