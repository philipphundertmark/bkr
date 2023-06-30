import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';

import { JwtPayload, Role } from '@bkr/api-interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _token$ = new BehaviorSubject<string | null>(null);
  readonly token$ = this._token$.asObservable();

  /**
   * Observable that emits information about the current user.
   * Emits `null`, if no user is logged in.
   */
  readonly user$ = this.token$.pipe(
    map((token) => (token !== null ? jwtDecode<JwtPayload>(token) : null))
  );

  readonly exp$ = this.user$.pipe(
    map((user) => (user?.exp ? dayjs(user.exp * 1000) : null))
  );
  readonly iat$ = this.user$.pipe(
    map((user) => (user?.iat ? dayjs(user.iat * 1000) : null))
  );
  readonly role$ = this.user$.pipe(
    map((user) => (user !== null ? user.role : null))
  );
  readonly sub$ = this.user$.pipe(map((user) => user?.sub ?? null));

  readonly isAuthenticated$ = this.user$.pipe(map((user) => user !== null));

  readonly isAdmin$ = this.user$.pipe(map((user) => user?.role === Role.ADMIN));
  readonly isStation$ = this.user$.pipe(
    map((user) => user?.role === Role.STATION)
  );

  constructor(private readonly http: HttpClient) {
    this.restore();
  }

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

    if (token === null) {
      return;
    }

    const { exp } = jwtDecode<JwtPayload>(token);

    return Date.now() < exp * 1000 ? this._token$.next(token) : this.logout();
  }
}
