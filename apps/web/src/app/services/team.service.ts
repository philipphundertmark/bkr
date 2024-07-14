import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

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
  constructor(private readonly http: HttpClient) {}

  createTeam(dto: CreateTeamSchema): Observable<Team> {
    return this.http
      .post<TeamDTO>('/teams', dto)
      .pipe(map(TeamUtils.deserialize));
  }

  getTeams(): Observable<Team[]> {
    return this.http
      .get<TeamDTO[]>('/teams')
      .pipe(map((teamDtos) => teamDtos.map(TeamUtils.deserialize)));
  }

  scheduleTeams(): Observable<Team[]> {
    return this.http
      .put<TeamDTO[]>('/teams/schedule', {})
      .pipe(map((teamDtos) => teamDtos.map(TeamUtils.deserialize)));
  }

  updateTeam(id: string, dto: UpdateTeamSchema): Observable<Team> {
    return this.http
      .put<TeamDTO>(`/teams/${id}`, dto)
      .pipe(map(TeamUtils.deserialize));
  }

  deleteTeam(id: string): Observable<void> {
    return this.http.delete<void>(`/teams/${id}`);
  }
}
