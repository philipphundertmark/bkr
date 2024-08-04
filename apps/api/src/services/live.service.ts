import { Server } from 'socket.io';
import winston from 'winston';

import {
  LiveEvent,
  LiveEventType,
  LiveEventUtils,
  Result,
  Settings,
  Station,
  Team,
} from '@bkr/api-interface';

import { loggerOptions } from '../logger';

export interface ILiveService {
  /**
   * Sends a "SET_RESULT" event with the specified result.
   *
   * @param result - The result to be sent in the event.
   */
  sendSetResultEvent(result: Result): void;

  /**
   * Sends a "SET_STATION" event with the specified station.
   *
   * @param station - The station to set.
   */
  sendSetStationEvent(station: Station): void;

  /**
   * Sends a "SET_TEAM" event with the specified team.
   *
   * @param team - The team to set.
   */
  sendSetTeamEvent(team: Team): void;

  /**
   * Sends a "SET_TEAMS" event with the specified teams.
   *
   * @param teams - The teams to set.
   */
  sendSetTeamsEvent(teams: Team[]): void;

  /**
   * Sends a "DELETE_RESULT" event with the specified station and team IDs.
   *
   * @param stationId - The ID of the station.
   * @param teamId - The ID of the team.
   */
  sendDeleteResultEvent(stationId: string, teamId: string): void;

  /**
   * Sends a "DELETE_RESULTS_OF_TEAM" event with the specified team ID.
   *
   * @param teamId - The ID of the team.
   */
  sendDeleteResultsOfTeamEvent(teamId: string): void;

  /**
   * Sends a "DELETE_STATION" event with the specified station ID.
   *
   * @param stationId - The ID of the station.
   */
  sendDeleteStationEvent(stationId: string): void;

  /**
   * Sends a "DELETE_TEAM" event with the specified team ID.
   *
   * @param teamId - The ID of the team.
   */
  sendDeleteTeamEvent(teamId: string): void;

  /**
   * Sends a "SET_SETTINGS" event with the specified settings.
   *
   * @param settings - The settings to set.
   */
  sendSetSettingsEvent(settings: Settings): void;
}

export class LiveService implements ILiveService {
  /**
   * The number of connected clients.
   */
  private connectionCount = 0;

  /**
   * The logger instance.
   */
  private readonly logger = winston.createLogger(loggerOptions);

  constructor(private readonly io: Server) {
    io.on('connection', (socket) => {
      this.logger.info(
        `[Live] Client connected (total: ${++this.connectionCount})`,
      );

      socket.on('disconnect', () => {
        this.logger.info(
          `[Live] Client disconnected (total: ${--this.connectionCount})`,
        );
      });
    });
  }

  /**
   * @implements {ILiveService}
   */
  sendSetResultEvent(result: Result): void {
    this.sendEvent({ type: LiveEventType.SET_RESULT, result });
  }

  /**
   * @implements {ILiveService}
   */
  sendSetStationEvent(station: Station): void {
    this.sendEvent({ type: LiveEventType.SET_STATION, station });
  }

  /**
   * @implements {ILiveService}
   */
  sendSetTeamEvent(team: Team): void {
    this.sendEvent({ type: LiveEventType.SET_TEAM, team });
  }

  /**
   * @implements {ILiveService}
   */
  sendSetTeamsEvent(teams: Team[]): void {
    this.sendEvent({ type: LiveEventType.SET_TEAMS, teams });
  }

  /**
   * @implements {ILiveService}
   */
  sendDeleteResultEvent(stationId: string, teamId: string): void {
    this.sendEvent({ type: LiveEventType.DELETE_RESULT, stationId, teamId });
  }

  /**
   * @implements {ILiveService}
   */
  sendDeleteResultsOfTeamEvent(teamId: string): void {
    this.sendEvent({ type: LiveEventType.DELETE_RESULTS_OF_TEAM, teamId });
  }

  /**
   * @implements {ILiveService}
   */
  sendDeleteStationEvent(stationId: string): void {
    this.sendEvent({ type: LiveEventType.DELETE_STATION, stationId });
  }

  /**
   * @implements {ILiveService}
   */
  sendDeleteTeamEvent(teamId: string): void {
    this.sendEvent({ type: LiveEventType.DELETE_TEAM, teamId });
  }

  /**
   * @implements {ILiveService}
   */
  sendSetSettingsEvent(settings: Settings): void {
    this.sendEvent({ type: LiveEventType.SET_SETTINGS, settings });
  }

  /**
   * Sends the specified event to all connected clients.
   *
   * @param event - The event to send.
   */
  private sendEvent(event: LiveEvent): void {
    this.logger.info(`[Live] Sending ${event.type} event to clients`);
    this.io.emit('event', LiveEventUtils.serialize(event));
  }
}
