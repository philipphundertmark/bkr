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
  private readonly _stations$ = new BehaviorSubject<Station[]>([]);
  readonly stations$ = this._stations$.pipe(
    map((stations) => stations.sort((a, b) => a.number - b.number)),
    shareReplay(1)
  );

  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.pipe(distinctUntilChanged());

  constructor(private readonly http: HttpClient) {}

  createStation(dto: CreateStationSchema): Observable<Station> {
    return this.http.post<StationDTO>('/stations', dto).pipe(
      map(StationUtils.deserialize),
      tap((station) =>
        this._stations$.next([...this._stations$.value, station])
      )
    );
  }

  getStations(): Observable<Station[]> {
    this._loading$.next(true);

    return this.http.get<StationDTO[]>('/stations').pipe(
      map((stationDtos) => stationDtos.map(StationUtils.deserialize)),
      tap((stations) => this._stations$.next(stations)),
      tap(() => this._loading$.next(false))
    );
  }

  updateStation(
    id: string,
    dto: UpdateStationSchema
  ): Observable<Station | null> {
    return this.http.put<StationDTO>(`/stations/${id}`, dto).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(null);
        }

        return throwError(() => error);
      }),
      map((stationDto) =>
        stationDto ? StationUtils.deserialize(stationDto) : null
      ),
      tap((updatedStation) => {
        if (!updatedStation) {
          return;
        }

        this._stations$.next(
          this._stations$.value.map((station) =>
            station.id === id ? updatedStation : station
          ) ?? null
        );
      })
    );
  }

  deleteStation(id: string): Observable<void> {
    return this.http
      .delete<void>(`/stations/${id}`)
      .pipe(
        tap(() =>
          this._stations$.next(
            this._stations$.value?.filter((station) => station.id !== id) ??
              null
          )
        )
      );
  }
}
