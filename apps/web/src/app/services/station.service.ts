import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import {
  CreateStationSchema,
  Station,
  StationDTO,
  StationUtils,
  UpdateStationSchema,
} from '@bkr/api-interface';

@Injectable({
  providedIn: 'root',
})
export class StationService {
  constructor(private readonly http: HttpClient) {}

  createStation(dto: CreateStationSchema): Observable<Station> {
    return this.http
      .post<StationDTO>('/stations', dto)
      .pipe(map(StationUtils.deserialize));
  }

  getStations(): Observable<Station[]> {
    return this.http
      .get<StationDTO[]>('/stations')
      .pipe(map((stationDtos) => stationDtos.map(StationUtils.deserialize)));
  }

  deleteStation(id: string): Observable<void> {
    return this.http.delete<void>(`/stations/${id}`);
  }

  updateStation(id: string, dto: UpdateStationSchema): Observable<Station> {
    return this.http
      .put<StationDTO>(`/stations/${id}`, dto)
      .pipe(map(StationUtils.deserialize));
  }
}
