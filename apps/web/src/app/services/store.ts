import { Injectable, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import dayjs from 'dayjs';
import { timer } from 'rxjs';

import {
  Result,
  Settings,
  Station,
  StationWithResults,
  Team,
  TeamUtils,
  TeamWithResults,
} from '@bkr/api-interface';

/** Initial results state */
const INITIAL_RESULTS: Result[] = [];
/** Initial settings state */
const INITIAL_SETTINGS: Settings = {
  createdAt: dayjs(),
  id: '00000000-0000-0000-0000-000000000000',
  publishResults: false,
  updatedAt: dayjs(),
};
/** Initial stations state */
const INITIAL_STATIONS: Station[] = [];
/** Initial teams state */
const INITIAL_TEAMS: Team[] = [];

@Injectable({
  providedIn: 'root',
})
export class Store {
  private _results = signal<Result[]>(INITIAL_RESULTS);
  private _settings = signal<Settings>(INITIAL_SETTINGS);
  private _stations = signal<Station[]>(INITIAL_STATIONS);
  private _teams = signal<Team[]>(INITIAL_TEAMS);

  private _sortedStationsWithResults = computed(() =>
    this._stations()
      // Find the results for each station
      .map<StationWithResults>((station) => ({
        ...station,
        results: this._results().filter(
          (result) => result.stationId === station.id,
        ),
      }))
      // Sort stations by number
      .sort((a, b) => a.number - b.number),
  );
  private _sortedTeamsWithResults = computed(() =>
    this._teams()
      // Find the results for each team
      .map<TeamWithResults>((team) => ({
        ...team,
        results: this._results().filter((result) => result.teamId === team.id),
      }))
      // Sort teams by number
      .sort((a, b) => a.number - b.number),
  );

  // Start the timer at the next full second
  private readonly timerStart = dayjs()
    .millisecond(0)
    .add(1, 'second')
    .toDate();
  private timer = toSignal(timer(this.timerStart, 1000));

  results = computed(() => this._results());
  settings = computed(() => this._settings());
  stations = computed(() => this._sortedStationsWithResults());
  teams = computed(() => {
    this.timer();
    return this._sortedTeamsWithResults().map((team) => ({ ...team }));
  });

  publishResults = computed(() => this._settings().publishResults);
  raceIsOver = computed(
    () =>
      this.teams().length > 0 &&
      this.teams().every(
        (team) => TeamUtils.isStarted(team) && TeamUtils.isFinished(team),
      ),
  );

  setResult(result: Result): void {
    this._results.update((results) => {
      let found = false;

      const updatedResults = results.map((existingResult) => {
        if (found) {
          return existingResult;
        }

        const exists =
          existingResult.stationId === result.stationId &&
          existingResult.teamId === result.teamId;

        if (exists) {
          found = true;
          return result;
        }

        return existingResult;
      });

      if (!found) {
        updatedResults.push(result);
      }

      return updatedResults;
    });
  }

  setStation(station: Station): void {
    this._stations.update((stations) => {
      let found = false;

      const updatedStations = stations.map((existingStation) => {
        if (found) {
          return existingStation;
        }

        const exists = existingStation.id === station.id;

        if (exists) {
          found = true;
          return station;
        }

        return existingStation;
      });

      if (!found) {
        updatedStations.push(station);
      }

      return updatedStations;
    });
  }

  setTeam(team: Team): void {
    this._teams.update((teams) => {
      let found = false;

      const updatedTeams = teams.map((existingTeam) => {
        if (found) {
          return existingTeam;
        }

        const exists = existingTeam.id === team.id;

        if (exists) {
          found = true;
          return team;
        }

        return existingTeam;
      });

      if (!found) {
        updatedTeams.push(team);
      }

      return updatedTeams;
    });
  }

  deleteResult(stationId: string, teamId: string): void {
    this._results.update((results) =>
      results.filter(
        (result) => result.stationId !== stationId || result.teamId !== teamId,
      ),
    );
  }

  deleteResultsByTeamId(teamId: string): void {
    this._results.update((results) =>
      results.filter((result) => result.teamId !== teamId),
    );
  }

  deleteStation(stationId: string): void {
    this._stations.update((stations) =>
      stations.filter((station) => station.id !== stationId),
    );
  }

  deleteTeam(teamId: string): void {
    this._teams.update((teams) => teams.filter((team) => team.id !== teamId));
  }

  setResults(results: Result[]): void {
    this._results.set(results);
  }

  setSettings(settings: Settings): void {
    this._settings.set(settings);
  }

  setStations(stations: Station[]): void {
    this._stations.set(stations);
  }

  setTeams(teams: Team[]): void {
    this._teams.set(teams);
  }
}
