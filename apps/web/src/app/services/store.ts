import { Injectable, computed, signal } from '@angular/core';
import dayjs from 'dayjs';

import {
  Result,
  Settings,
  Station,
  StationWithResults,
  Team,
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

  private _resultsLoading = signal<boolean>(false);
  private _settingsLoading = signal<boolean>(false);
  private _stationsLoading = signal<boolean>(false);
  private _teamsLoading = signal<boolean>(false);

  private _resultsError = signal<Error | null>(null);
  private _settingsError = signal<Error | null>(null);
  private _stationsError = signal<Error | null>(null);
  private _teamsError = signal<Error | null>(null);

  settings = computed(() => this._settings());
  stations = computed(() =>
    this._stations()
      // Find the results for each station
      .map<StationWithResults>((station) => ({
        ...station,
        results: this._results().filter(
          (result) => result.stationId === station.id,
        ),
      }))
      // Sort stations by number
      .sort((a, b) => (a.number = b.number)),
  );
  teams = computed(() =>
    this._teams()
      // Find the results for each team
      .map<TeamWithResults>((team) => ({
        ...team,
        results: this._results().filter((result) => result.teamId === team.id),
      }))
      // Sort teams by number
      .sort((a, b) => (a.number = b.number)),
  );

  resultsLoading = computed(() => this._resultsLoading());
  settingsLoading = computed(() => this._settingsLoading());
  stationsLoading = computed(() => this._stationsLoading());
  teamsLoading = computed(() => this._teamsLoading());

  resultsError = computed(() => this._resultsError());
  settingsError = computed(() => this._settingsError());
  stationsError = computed(() => this._stationsError());
  teamsError = computed(() => this._teamsError());

  publishResults = computed(() => this._settings().publishResults);
  raceIsOver = computed(
    () =>
      this._teams().length > 0 &&
      this._teams().every(
        (team) =>
          typeof team.startedAt !== 'undefined' &&
          typeof team.finishedAt !== 'undefined',
      ),
  );

  createResult(result: Result): void {
    this._results.update((results) => [...results, result]);
  }

  createStation(station: Station): void {
    this._stations.update((stations) => [...stations, station]);
  }

  createTeam(team: Team): void {
    this._teams.update((teams) => [...teams, team]);
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

  deleteStation(deletedStation: Station): void {
    this._stations.update((stations) =>
      stations.filter((station) => station.id !== deletedStation.id),
    );
  }

  deleteTeam(deletedTeam: Team): void {
    this._teams.update((teams) =>
      teams.filter((team) => team.id !== deletedTeam.id),
    );
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

  setResultsError(error: Error | null): void {
    this._resultsError.set(error);
  }

  setSettingsError(error: Error | null): void {
    this._settingsError.set(error);
  }

  setStationsError(error: Error | null): void {
    this._stationsError.set(error);
  }

  setTeamsError(error: Error | null): void {
    this._teamsError.set(error);
  }

  setResultsLoading(loading: boolean): void {
    this._resultsLoading.set(loading);
  }

  setSettingsLoading(loading: boolean): void {
    this._settingsLoading.set(loading);
  }

  setStationsLoading(loading: boolean): void {
    this._stationsLoading.set(loading);
  }

  setTeamsLoading(loading: boolean): void {
    this._teamsLoading.set(loading);
  }

  updateResult(updatedResult: Result): void {
    this._results.update((results) =>
      results.map((result) =>
        result.stationId === updatedResult.stationId &&
        result.teamId === updatedResult.teamId
          ? updatedResult
          : result,
      ),
    );
  }

  updateStation(updatedStation: Station): void {
    this._stations.update((stations) =>
      stations.map((station) =>
        station.id === updatedStation.id ? updatedStation : station,
      ),
    );
  }

  updateTeam(updatedTeam: Team): void {
    this._teams.update((teams) =>
      teams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team)),
    );
  }
}
