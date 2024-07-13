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

export class LiveService {
  private readonly logger = winston.createLogger(loggerOptions);

  constructor(private readonly io: Server) {
    io.on('connection', (socket) => {
      this.logger.info(`[Live] Client connected`);

      socket.on('disconnect', () => {
        this.logger.info(`[Live] Client disconnected`);
      });
    });
  }

  sendCreateResultEvent(result: Result): void {
    this.sendEvent({ type: LiveEventType.CREATE_RESULT, result });
  }

  sendCreateStationEvent(station: Station): void {
    this.sendEvent({ type: LiveEventType.CREATE_STATION, station });
  }

  sendCreateTeamEvent(team: Team): void {
    this.sendEvent({ type: LiveEventType.CREATE_TEAM, team });
  }

  sendDeleteResultEvent(stationId: string, teamId: string): void {
    this.sendEvent({ type: LiveEventType.DELETE_RESULT, stationId, teamId });
  }

  sendDeleteResultsOfTeamEvent(teamId: string): void {
    this.sendEvent({ type: LiveEventType.DELETE_RESULTS_OF_TEAM, teamId });
  }

  sendDeleteStationEvent(stationId: string): void {
    this.sendEvent({ type: LiveEventType.DELETE_STATION, stationId });
  }

  sendDeleteTeamEvent(teamId: string): void {
    this.sendEvent({ type: LiveEventType.DELETE_TEAM, teamId });
  }

  sendSetSettingsEvent(settings: Settings): void {
    this.sendEvent({ type: LiveEventType.SET_SETTINGS, settings });
  }

  sendUpdateResultEvent(result: Result): void {
    this.sendEvent({ type: LiveEventType.UPDATE_RESULT, result });
  }

  sendUpdateStationEvent(station: Station): void {
    this.sendEvent({ type: LiveEventType.UPDATE_STATION, station });
  }

  sendUpdateTeamEvent(team: Team): void {
    this.sendEvent({ type: LiveEventType.UPDATE_TEAM, team });
  }

  private sendEvent(event: LiveEvent): void {
    this.logger.info(`[Live] Sending ${event.type} event to clients`);
    this.io.emit('event', LiveEventUtils.serialize(event));
  }
}
