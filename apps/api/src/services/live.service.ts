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

  sendSetResultEvent(result: Result): void {
    this.sendEvent({ type: LiveEventType.SET_RESULT, result });
  }

  sendSetStationEvent(station: Station): void {
    this.sendEvent({ type: LiveEventType.SET_STATION, station });
  }

  sendSetTeamEvent(team: Team): void {
    this.sendEvent({ type: LiveEventType.SET_TEAM, team });
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

  private sendEvent(event: LiveEvent): void {
    this.logger.info(`[Live] Sending ${event.type} event to clients`);
    this.io.emit('event', LiveEventUtils.serialize(event));
  }
}
