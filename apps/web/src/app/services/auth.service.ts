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
    map((token) => (token !== null ? jwtDecode<JwtPayload>(token) : null)),
  );

  /**
   * Observable that emits the expiration date of the current token.
   */
  readonly exp$ = this.user$.pipe(
    map((user) => (user?.exp ? dayjs(user.exp * 1000) : null)),
  );

  /**
   * Observable that emits the issue date of the current token.
   */
  readonly iat$ = this.user$.pipe(
    map((user) => (user?.iat ? dayjs(user.iat * 1000) : null)),
  );

  /**
   * Observable that emits the role of the current user.
   */
  readonly role$ = this.user$.pipe(
    map((user) => (user !== null ? user.role : null)),
  );

  /**
   * Observable that emits the sub of the current user.
   * If the user has role `Role.STATION`, the sub is the station id.
   */
  readonly sub$ = this.user$.pipe(map((user) => user?.sub ?? null));

  /**
   * Observable that emits whether the current user is authenticated.
   */
  readonly isAuthenticated$ = this.user$.pipe(map((user) => user !== null));

  readonly isAdmin$ = this.user$.pipe(map((user) => user?.role === Role.ADMIN));
  readonly isStation$ = this.user$.pipe(
    map((user) => user?.role === Role.STATION),
  );

  constructor(private readonly http: HttpClient) {
    this.restore();
  }

  /**
   * Authenticate the user with the given code.
   * @param code The code to authenticate with.
   * @returns An observable that emits the token.
   */
  login(code: string): Observable<string> {
    return this.http
      .post<{ token: string }>('/token', {
        code: code,
      })
      .pipe(
        map((res) => res.token),
        tap((token) => this._token$.next(token)),
        tap((token) => localStorage.setItem('token', token)),
      );
  }

  /**
   * Log the user out.
   */
  logout(): void {
    localStorage.removeItem('token');
    this._token$.next(null);
  }

  /**
   * Restore the token from local storage and check if it is still valid.
   */
  restore(): void {
    const token = localStorage.getItem('token');

    if (token === null) {
      return;
    }

    const { exp } = jwtDecode<JwtPayload>(token);

    return Date.now() < exp * 1000 ? this._token$.next(token) : this.logout();
  }
}
