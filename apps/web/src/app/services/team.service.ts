import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  tap,
  throwError,
} from 'rxjs';

import {
  CreateTeamSchema,
  Team,
  TeamDTO,
  TeamUtils,
  UpdateTeamSchema,
} from '@bkr/api-interface';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private readonly _teams$ = new BehaviorSubject<Team[]>([]);
  readonly teams$ = this._teams$.pipe(
    map((teams) => teams.sort((a, b) => a.number - b.number)),
    shareReplay(1)
  );

  private readonly _loading$ = new BehaviorSubject<boolean>(true);
  readonly loading$ = this._loading$.pipe(distinctUntilChanged());

  constructor(private readonly http: HttpClient) {}

  createTeam(dto: CreateTeamSchema): Observable<Team> {
    return this.http.post<TeamDTO>('/teams', dto).pipe(
      map(TeamUtils.deserialize),
      tap((team) => this._teams$.next([...this._teams$.value, team]))
    );
  }

  getTeams(): Observable<Team[]> {
    this._loading$.next(true);

    return this.http.get<TeamDTO[]>('/teams').pipe(
      map((teamDtos) => teamDtos.map(TeamUtils.deserialize)),
      tap((teams) => this._teams$.next(teams)),
      tap(() => this._loading$.next(false))
    );
  }

  updateTeam(id: string, dto: UpdateTeamSchema): Observable<Team | null> {
    return this.http.put<TeamDTO>(`/teams/${id}`, dto).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(null);
        }

        return throwError(() => error);
      }),
      map((teamDto) => (teamDto ? TeamUtils.deserialize(teamDto) : null)),
      tap((updatedTeam) => {
        if (!updatedTeam) {
          return;
        }

        this._teams$.next(
          this._teams$.value.map((team) =>
            team.id === id ? updatedTeam : team
          ) ?? null
        );
      })
    );
  }

  deleteTeam(id: string): Observable<void> {
    return this.http
      .delete<void>(`/teams/${id}`)
      .pipe(
        tap(() =>
          this._teams$.next(
            this._teams$.value?.filter((team) => team.id !== id) ?? null
          )
        )
      );
  }
}
