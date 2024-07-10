import { LiveEvent, LiveEventType } from './live-event';
import { ResultUtils } from './result.utils';
import { StationUtils } from './station.utils';
import { TeamUtils } from './team.utils';

export const LiveEventUtils = {
  deserialize(serialized: string): LiveEvent {
    const event = JSON.parse(serialized);

    switch (event.type) {
      case LiveEventType.CREATE_RESULT:
      case LiveEventType.UPDATE_RESULT:
        return {
          ...event,
          result: ResultUtils.deserialize(event.result),
        };
      case LiveEventType.DELETE_RESULT:
        return {
          ...event,
        };
      case LiveEventType.CREATE_STATION:
      case LiveEventType.UPDATE_STATION:
        return {
          ...event,
          station: StationUtils.deserialize(event.station),
        };
      case LiveEventType.DELETE_STATION:
        return {
          ...event,
        };
      case LiveEventType.CREATE_TEAM:
      case LiveEventType.UPDATE_TEAM:
        return {
          ...event,
          team: TeamUtils.deserialize(event.team),
        };
      case LiveEventType.DELETE_TEAM:
        return {
          ...event,
        };
      default:
        throw new Error(`Unknown event type: ${event.type}`);
    }
  },
  serialize(event: LiveEvent): string {
    switch (event.type) {
      case LiveEventType.CREATE_RESULT:
      case LiveEventType.UPDATE_RESULT:
        return JSON.stringify({
          ...event,
          result: ResultUtils.serialize(event.result),
        });
      case LiveEventType.DELETE_RESULT:
        return JSON.stringify({
          ...event,
        });
      case LiveEventType.CREATE_STATION:
      case LiveEventType.UPDATE_STATION:
        return JSON.stringify({
          ...event,
          station: StationUtils.serialize(event.station),
        });
      case LiveEventType.DELETE_STATION:
        return JSON.stringify({
          ...event,
        });
      case LiveEventType.CREATE_TEAM:
      case LiveEventType.UPDATE_TEAM:
        return JSON.stringify({
          ...event,
          team: TeamUtils.serialize(event.team),
        });
      case LiveEventType.DELETE_TEAM:
        return JSON.stringify({
          ...event,
        });
    }
  },
};
