import { Result } from './result';
import { Settings } from './settings';
import { Station } from './station';
import { Team } from './team';

export type LiveEvent =
  // Results
  | DeleteResultLiveEvent
  | DeleteResultsOfTeamLiveEvent
  | SetResultLiveEvent
  // Settings
  | SetSettingsLiveEvent
  // Stations
  | DeleteStationLiveEvent
  | SetStationLiveEvent
  // Teams
  | DeleteTeamLiveEvent
  | SetTeamLiveEvent
  | SetTeamsLiveEvent;

export enum LiveEventType {
  // Results
  DELETE_RESULT = 'DELETE_RESULT',
  DELETE_RESULTS_OF_TEAM = 'DELETE_RESULTS_OF_TEAM',
  SET_RESULT = 'SET_RESULT',
  // Settings
  SET_SETTINGS = 'SET_SETTINGS',
  // Stations
  DELETE_STATION = 'DELETE_STATION',
  SET_STATION = 'SET_STATION',
  // Teams
  DELETE_TEAM = 'DELETE_TEAM',
  SET_TEAM = 'SET_TEAM',
  SET_TEAMS = 'SET_TEAMS',
}

export interface DeleteResultLiveEvent {
  type: LiveEventType.DELETE_RESULT;
  stationId: string;
  teamId: string;
}

export interface DeleteResultsOfTeamLiveEvent {
  type: LiveEventType.DELETE_RESULTS_OF_TEAM;
  teamId: string;
}

export interface SetResultLiveEvent {
  type: LiveEventType.SET_RESULT;
  result: Result;
}

export interface SetSettingsLiveEvent {
  type: LiveEventType.SET_SETTINGS;
  settings: Settings;
}

export interface DeleteStationLiveEvent {
  type: LiveEventType.DELETE_STATION;
  stationId: string;
}

export interface SetStationLiveEvent {
  type: LiveEventType.SET_STATION;
  station: Station;
}

export interface DeleteTeamLiveEvent {
  type: LiveEventType.DELETE_TEAM;
  teamId: string;
}

export interface SetTeamLiveEvent {
  type: LiveEventType.SET_TEAM;
  team: Team;
}

export interface SetTeamsLiveEvent {
  type: LiveEventType.SET_TEAMS;
  teams: Team[];
}
