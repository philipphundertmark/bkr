import { Result } from './result';
import { Station } from './station';
import { Team } from './team';

export type LiveEvent =
  | CreateTeamLiveEvent
  | DeleteTeamLiveEvent
  | UpdateTeamLiveEvent
  | CreateStationLiveEvent
  | DeleteStationLiveEvent
  | UpdateStationLiveEvent
  | CreateResultLiveEvent
  | DeleteResultLiveEvent
  | UpdateResultLiveEvent;

export enum LiveEventType {
  CREATE_TEAM = 'CREATE_TEAM',
  DELETE_TEAM = 'DELETE_TEAM',
  UPDATE_TEAM = 'UPDATE_TEAM',
  CREATE_STATION = 'CREATE_STATION',
  DELETE_STATION = 'DELETE_STATION',
  UPDATE_STATION = 'UPDATE_STATION',
  CREATE_RESULT = 'CREATE_RESULT',
  DELETE_RESULT = 'DELETE_RESULT',
  UPDATE_RESULT = 'UPDATE_RESULT',
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
