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

export enum EventType {
  Start = 'start',
  Finish = 'finish',
  CheckIn = 'check-in',
  CheckOut = 'check-out',
}

export interface StartEvent {
  timestamp: dayjs.Dayjs;
  type: EventType.Start;
  team: Team;
}

export interface FinishEvent {
  timestamp: dayjs.Dayjs;
  type: EventType.Finish;
  team: Team;
}

export interface CheckInEvent {
  timestamp: dayjs.Dayjs;
  type: EventType.CheckIn;
  team: Team;
  station: Station;
}

export interface CheckOutEvent {
  timestamp: dayjs.Dayjs;
  type: EventType.CheckOut;
  team: Team;
  station: Station;
}

export type Event = StartEvent | FinishEvent | CheckInEvent | CheckOutEvent;

@Injectable({
  providedIn: 'root',
})
export class Store {
  private _results = signal<Result[]>(INITIAL_RESULTS);
  private _settings = signal<Settings>(INITIAL_SETTINGS);
  private _stations = signal<Station[]>(INITIAL_STATIONS);
  private _teams = signal<Team[]>(INITIAL_TEAMS);

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
      .sort((a, b) => a.number - b.number),
  );
  teams = computed(() =>
    this._teams()
      // Find the results for each team
      .map<TeamWithResults>((team) => ({
        ...team,
        results: this._results().filter((result) => result.teamId === team.id),
      }))
      // Sort teams by number
      .sort((a, b) => a.number - b.number),
  );

  events = computed(() =>
    this.computeEvents(this._results(), this._stations(), this._teams()),
  );
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

  private computeEvents(
    results: Result[],
    stations: Station[],
    teams: Team[],
  ): Event[] {
    const events: Event[] = [];

    teams.forEach((team) => {
      // Generate `Start` event if team has started
      if (team.startedAt) {
        events.push({
          timestamp: team.startedAt,
          type: EventType.Start,
          team,
        });
      }

      // Generate `Finish` event if team has finished
      if (team.finishedAt) {
        events.push({
          timestamp: team.finishedAt,
          type: EventType.Finish,
          team,
        });
      }
    });

    results.forEach((result) => {
      const station = stations.find((s) => s.id === result.stationId);
      const team = teams.find((t) => t.id === result.teamId);

      if (!station || !team) {
        return;
      }

      // Generate `CheckIn` event
      events.push({
        timestamp: result.checkIn,
        type: EventType.CheckIn,
        team,
        station,
      });

      // Generate `CheckOut` event if team has checked out
      if (result.checkOut) {
        events.push({
          timestamp: result.checkOut,
          type: EventType.CheckOut,
          team,
          station,
        });
      }
    });

    return events.sort((a, b) => b.timestamp.diff(a.timestamp));
  }
}
