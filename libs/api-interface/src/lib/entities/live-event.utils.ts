import { LiveEvent, LiveEventType } from './live-event';
import { ResultUtils } from './result.utils';
import { SettingsUtils } from './settings.utils';
import { StationUtils } from './station.utils';
import { TeamUtils } from './team.utils';

export const LiveEventUtils = {
  deserialize(serialized: string): LiveEvent {
    const event = JSON.parse(serialized);

    switch (event.type) {
      case LiveEventType.DELETE_RESULT:
      case LiveEventType.DELETE_RESULTS_OF_TEAM:
        return {
          ...event,
        };
      case LiveEventType.SET_RESULT:
        return {
          ...event,
          result: ResultUtils.deserialize(event.result),
        };
      case LiveEventType.SET_SETTINGS:
        return {
          ...event,
          settings: SettingsUtils.deserialize(event.settings),
        };
      case LiveEventType.DELETE_STATION:
        return {
          ...event,
        };
      case LiveEventType.SET_STATION:
        return {
          ...event,
          station: StationUtils.deserialize(event.station),
        };
      case LiveEventType.DELETE_TEAM:
        return {
          ...event,
        };
      case LiveEventType.SET_TEAM:
        return {
          ...event,
          team: TeamUtils.deserialize(event.team),
        };
      default:
        throw new Error(`Unknown event type: ${event.type}`);
    }
  },
  serialize(event: LiveEvent): string {
    switch (event.type) {
      case LiveEventType.DELETE_RESULT:
      case LiveEventType.DELETE_RESULTS_OF_TEAM:
        return JSON.stringify({
          ...event,
        });
      case LiveEventType.SET_RESULT:
        return JSON.stringify({
          ...event,
          result: ResultUtils.serialize(event.result),
        });
      case LiveEventType.SET_SETTINGS:
        return JSON.stringify({
          ...event,
          settings: SettingsUtils.serialize(event.settings),
        });
      case LiveEventType.DELETE_STATION:
        return JSON.stringify({
          ...event,
        });
      case LiveEventType.SET_STATION:
        return JSON.stringify({
          ...event,
          station: StationUtils.serialize(event.station),
        });
      case LiveEventType.DELETE_TEAM:
        return JSON.stringify({
          ...event,
        });
      case LiveEventType.SET_TEAM:
        return JSON.stringify({
          ...event,
          team: TeamUtils.serialize(event.team),
        });
    }
  },
};
