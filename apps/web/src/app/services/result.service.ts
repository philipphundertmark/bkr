import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

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
  constructor(private readonly http: HttpClient) {}

  createResult(stationId: string, teamId: string): Observable<Result> {
    return this.http
      .post<ResultDTO>(`/stations/${stationId}/results`, { teamId })
      .pipe(map(ResultUtils.deserialize));
  }

  deleteResult(stationId: string, teamId: string): Observable<void> {
    return this.http.delete<void>(`/stations/${stationId}/results/${teamId}`);
  }

  deleteResultsByTeamId(teamId: string): Observable<void> {
    return this.http.delete<void>(`/teams/${teamId}/results`);
  }

  getResults(): Observable<Result[]> {
    return this.http
      .get<ResultDTO[]>('/results')
      .pipe(map((resultDtos) => resultDtos.map(ResultUtils.deserialize)));
  }

  updateResult(
    stationId: string,
    teamId: string,
    dto: UpdateResultSchema,
  ): Observable<Result> {
    return this.http
      .put<ResultDTO>(`/stations/${stationId}/results/${teamId}`, dto)
      .pipe(map(ResultUtils.deserialize));
  }
}
