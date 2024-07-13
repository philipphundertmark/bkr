import { Result } from './result';
import { Settings } from './settings';
import { Station } from './station';
import { Team } from './team';

export type LiveEvent =
  | CreateResultLiveEvent
  | DeleteResultLiveEvent
  | DeleteResultsOfTeamLiveEvent
  | UpdateResultLiveEvent
  | CreateStationLiveEvent
  | DeleteStationLiveEvent
  | UpdateStationLiveEvent
  | CreateTeamLiveEvent
  | DeleteTeamLiveEvent
  | UpdateTeamLiveEvent
  | SetSettingsLiveEvent;

export enum LiveEventType {
  CREATE_RESULT = 'CREATE_RESULT',
  DELETE_RESULT = 'DELETE_RESULT',
  DELETE_RESULTS_OF_TEAM = 'DELETE_RESULTS_OF_TEAM',
  UPDATE_RESULT = 'UPDATE_RESULT',
  CREATE_STATION = 'CREATE_STATION',
  DELETE_STATION = 'DELETE_STATION',
  UPDATE_STATION = 'UPDATE_STATION',
  CREATE_TEAM = 'CREATE_TEAM',
  DELETE_TEAM = 'DELETE_TEAM',
  UPDATE_TEAM = 'UPDATE_TEAM',
  SET_SETTINGS = 'SET_SETTINGS',
}

export interface CreateResultLiveEvent {
  type: LiveEventType.CREATE_RESULT;
  result: Result;
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

export interface UpdateResultLiveEvent {
  type: LiveEventType.UPDATE_RESULT;
  result: Result;
}

export interface CreateStationLiveEvent {
  type: LiveEventType.CREATE_STATION;
  station: Station;
}

export interface DeleteStationLiveEvent {
  type: LiveEventType.DELETE_STATION;
  stationId: string;
}

export interface UpdateStationLiveEvent {
  type: LiveEventType.UPDATE_STATION;
  station: Station;
}

export interface CreateTeamLiveEvent {
  type: LiveEventType.CREATE_TEAM;
  team: Team;
}

export interface DeleteTeamLiveEvent {
  type: LiveEventType.DELETE_TEAM;
  teamId: string;
}

export interface UpdateTeamLiveEvent {
  type: LiveEventType.UPDATE_TEAM;
  team: Team;
}

export interface SetSettingsLiveEvent {
  type: LiveEventType.SET_SETTINGS;
  settings: Settings;
}
