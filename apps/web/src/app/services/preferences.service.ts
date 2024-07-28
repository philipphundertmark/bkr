import { Injectable, effect, signal } from '@angular/core';

import { Ranking } from '@bkr/api-interface';

export enum UserPreference {
  ENDRESULT_SELECTED_RANKING = 'bkr.endresult.selectedRanking',
  HOME_SELECTED_RANKING = 'bkr.home.selectedRanking',
  HOME_SELECTED_TAB = 'bkr.home.selectedTab',
  MY_STATION_SELECTED_RANKING = 'bkr.myStation.selectedRanking',
  STATION_RESULTS_SELECTED_RANKING = 'bkr.stationResults.selectedRanking',
}

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  endresultSelectedRanking = signal(
    this.restore<Ranking>(UserPreference.ENDRESULT_SELECTED_RANKING, Ranking.A),
  );

  homeSelectedRanking = signal(
    this.restore<Ranking>(UserPreference.HOME_SELECTED_RANKING, Ranking.A),
  );
  homeActiveTab = signal(
    this.restore<string>(UserPreference.HOME_SELECTED_TAB, 'overview'),
  );

  myStationSelectedRanking = signal(
    this.restore<Ranking>(
      UserPreference.MY_STATION_SELECTED_RANKING,
      Ranking.A,
    ),
  );

  stationResultsSelectedRanking = signal(
    this.restore<Ranking>(
      UserPreference.STATION_RESULTS_SELECTED_RANKING,
      Ranking.A,
    ),
  );

  constructor() {
    effect(() => {
      localStorage.setItem(
        UserPreference.ENDRESULT_SELECTED_RANKING,
        this.endresultSelectedRanking(),
      );
    });

    effect(() => {
      localStorage.setItem(
        UserPreference.HOME_SELECTED_RANKING,
        this.homeSelectedRanking(),
      );
    });
    effect(() => {
      localStorage.setItem(
        UserPreference.HOME_SELECTED_TAB,
        this.homeActiveTab(),
      );
    });

    effect(() => {
      localStorage.setItem(
        UserPreference.MY_STATION_SELECTED_RANKING,
        this.myStationSelectedRanking(),
      );
    });

    effect(() => {
      localStorage.setItem(
        UserPreference.STATION_RESULTS_SELECTED_RANKING,
        this.stationResultsSelectedRanking(),
      );
    });
  }

  private restore<T>(key: UserPreference, fallback: T): T {
    const value = localStorage.getItem(key);

    return value !== null ? (value as T) : fallback;
  }
}
