import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

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
  constructor(private readonly http: HttpClient) {}

  getSettings(): Observable<Settings> {
    return this.http
      .get<SettingsDTO>('/settings')
      .pipe(map(SettingsUtils.deserialize));
  }

  updateSettings(dto: UpdateSettingsSchema): Observable<Settings> {
    return this.http
      .put<SettingsDTO>('/settings', dto)
      .pipe(map(SettingsUtils.deserialize));
  }
}
