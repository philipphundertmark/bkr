import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map, tap } from 'rxjs';

import {
  Result,
  ResultDTO,
  ResultUtils,
  UpdateResultSchema,
} from '@bkr/api-interface';

@Injectable({
  providedIn: 'root',
})
export class ResultService {
  private readonly _newResult$ = new Subject<Result>();
  readonly newResult$ = this._newResult$.asObservable();

  private readonly _updatedResult$ = new Subject<Result>();
  readonly updatedResult$ = this._updatedResult$.asObservable();

  private readonly _deletedResult$ = new Subject<{
    stationId: string;
    teamId: string;
  }>();
  readonly deletedResult$ = this._deletedResult$.asObservable();

  constructor(private readonly http: HttpClient) {}

  createResult(stationId: string, teamId: string): Observable<Result> {
    return this.http
      .post<ResultDTO>(`/stations/${stationId}/results`, { teamId })
      .pipe(
        map(ResultUtils.deserialize),
        tap((result) => this._newResult$.next(result))
      );
  }

  updateResult(
    stationId: string,
    teamId: string,
    dto: UpdateResultSchema
  ): Observable<Result> {
    return this.http
      .put<ResultDTO>(`/stations/${stationId}/results/${teamId}`, dto)
      .pipe(
        map(ResultUtils.deserialize),
        tap((result) => this._updatedResult$.next(result))
      );
  }

  deleteResult(stationId: string, teamId: string): Observable<void> {
    return this.http
      .delete<void>(`/stations/${stationId}/results/${teamId}`)
      .pipe(tap(() => this._deletedResult$.next({ stationId, teamId })));
  }
}
