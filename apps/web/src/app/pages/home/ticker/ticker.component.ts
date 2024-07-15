import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import dayjs from 'dayjs';

import { Result, Station, Team, TeamUtils } from '@bkr/api-interface';

import { EmptyComponent } from '../../../components';
import { TimePipe } from '../../../pipes';

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

@Component({
  selector: 'bkr-ticker',
  standalone: true,
  imports: [CommonModule, EmptyComponent, RouterModule, TimePipe],
  host: { class: 'card' },
  styleUrl: './ticker.component.scss',
  templateUrl: './ticker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TickerComponent {
  readonly EventType = EventType;

  isRaceOver = input(false);

  results = input.required<Result[]>();
  stations = input.required<Station[]>();
  teams = input.required<Team[]>();

  events = computed(() =>
    this.computeEvents(this.results(), this.stations(), this.teams()),
  );

  private computeEvents(
    results: Result[],
    stations: Station[],
    teams: Team[],
  ): Event[] {
    const events: Event[] = [];

    teams.forEach((team) => {
      // Generate `Start` event if team has started
      if (TeamUtils.isStarted(team)) {
        events.push({
          timestamp: team.startedAt,
          type: EventType.Start,
          team,
        });
      }

      // Generate `Finish` event if team has finished
      if (TeamUtils.isFinished(team)) {
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
