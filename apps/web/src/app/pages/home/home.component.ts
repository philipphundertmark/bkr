import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { EMPTY, map, switchMap, timer } from 'rxjs';

import {
  Result,
  Station,
  Team,
  TeamUtils,
  TeamWithResults,
} from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  RankingComponent,
  TabComponent,
  TabsComponent,
} from '../../components';
import {
  ArrowPathRoundedSquareIconComponent,
  CheckCircleIconComponent,
  TrophyIconComponent,
} from '../../icons/mini';
import { DurationPipe } from '../../pipes';
import { AuthService, NotificationService, TeamService } from '../../services';
import { ConfirmService } from '../../services/confirm.service';
import { EventType, Store } from '../../services/store';
import { ClockComponent } from './clock/clock.component';
import { TickerComponent } from './ticker/ticker.component';

dayjs.extend(duration);

export interface TimeByTeam {
  [teamId: string]: number;
}

export interface RankingItem {
  finished: boolean;
  team: Team;
  progress: number;
  started: boolean;
  stationIds: string[];
  time: number;
}

@Component({
  selector: 'bkr-home',
  standalone: true,
  imports: [
    ArrowPathRoundedSquareIconComponent,
    ButtonComponent,
    CheckCircleIconComponent,
    ClockComponent,
    CommonModule,
    DurationPipe,
    EmptyComponent,
    RankingComponent,
    RouterModule,
    TabComponent,
    TabsComponent,
    TickerComponent,
    TrophyIconComponent,
  ],
  host: { class: 'page' },
  styleUrl: './home.component.scss',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly EventType = EventType;
  readonly TeamUtils = TeamUtils;

  activeTab = signal(localStorage.getItem('activeTab') ?? 'overview');
  ranking = signal(localStorage.getItem('ranking') ?? 'standard');

  isAdmin = toSignal(this.authService.isAdmin$, { initialValue: false });
  isStation = toSignal(this.authService.isStation$, { initialValue: false });

  events = this.store.events;
  isRaceOver = this.store.raceIsOver;
  publishResults = this.store.publishResults;
  stations = this.store.stations;
  teams = this.store.teams;

  times$ = timer(0, 1000).pipe(
    map(() =>
      this.teams().reduce<TimeByTeam>(
        (times, team) => ({
          ...times,
          [team.id]: TeamUtils.getTime(team),
        }),
        {},
      ),
    ),
  );
  times = toSignal(this.times$, {
    initialValue: this.teams().reduce<TimeByTeam>(
      (times, team) => ({ ...times, [team.id]: 0 }),
      {},
    ),
  });

  rankingItems = computed((): RankingItem[] => {
    const stations = this.stations();
    const times = this.times();

    const segment = 100 / (stations.length + 1);
    const halfSegment = segment / 2;

    return this.teams().map((team) => {
      const latestResult = this.getLatestResult(team, stations);

      return {
        finished: TeamUtils.isFinished(team),
        progress: TeamUtils.isFinished(team)
          ? 100
          : team.results.length
            ? team.results.length * segment +
              (typeof latestResult?.checkOut !== 'undefined' ? halfSegment : 0)
            : TeamUtils.isStarted(team)
              ? halfSegment
              : 0,
        started: TeamUtils.isStarted(team),
        stationIds: team.results.map((result) => result.stationId),
        team,
        time: times[team.id],
      };
    });
  });

  shuffleTeamsLoading = signal(false);

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly authService: AuthService,
    private readonly confirmService: ConfirmService,
    private readonly notificationService: NotificationService,
    private readonly store: Store,
    private readonly teamService: TeamService,
  ) {
    effect(() => {
      localStorage.setItem('activeTab', this.activeTab());
    });

    effect(() => {
      localStorage.setItem('ranking', this.ranking());
    });
  }

  hasStationId(rankingItem: RankingItem, stationId: string): boolean {
    return rankingItem.stationIds.includes(stationId);
  }

  shuffleTeams(): void {
    this.confirmService
      .info({
        title: 'Reihenfolge auslosen',
        message: 'Möchtest du die Reihenfolge der Teams wirklich neu auslosen?',
      })

      .pipe(
        switchMap((confirmed) => {
          if (!confirmed) return EMPTY;

          this.shuffleTeamsLoading.set(true);

          return this.teamService.scheduleTeams();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (teams) => {
          this.shuffleTeamsLoading.set(false);
          this.store.setTeams(teams);
          this.notificationService.success('Reihenfolge wurde ausgelost.');
        },
        error: () => {
          this.shuffleTeamsLoading.set(false);
          this.notificationService.error(
            'Reihenfolge konnte nicht ausgelost werden.',
          );
        },
      });
  }

  private getLatestResult(
    team: TeamWithResults,
    stations: Station[],
  ): Result | undefined {
    const stationNumbers = team.results
      .map(({ stationId }) => stations.find(({ id }) => id === stationId))
      .filter((station): station is Station => typeof station !== 'undefined')
      .map((station) => station.number);

    const maxStationNumber = Math.max(...stationNumbers);
    const latestStation = stations.find(
      ({ number }) => number === maxStationNumber,
    );

    return team.results.find(
      ({ stationId }) => stationId === latestStation?.id,
    );
  }
}
