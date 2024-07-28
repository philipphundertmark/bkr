import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import {
  Ranking,
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
  CheckCircleIconComponent,
  TrophyIconComponent,
} from '../../icons/mini';
import { DurationPipe } from '../../pipes';
import { AuthService, PreferencesService } from '../../services';
import { Store } from '../../services/store';
import { TickerComponent } from './ticker/ticker.component';

dayjs.extend(duration);

export interface RankingItem {
  countdown: number;
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
    ButtonComponent,
    CheckCircleIconComponent,
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
  readonly Ranking = Ranking;
  readonly TeamUtils = TeamUtils;

  activeTab = this.preferencesService.homeActiveTab;
  ranking = this.preferencesService.homeSelectedRanking;

  isAdmin = toSignal(this.authService.isAdmin$, { initialValue: false });
  isStation = toSignal(this.authService.isStation$, { initialValue: false });

  results = this.store.results;
  stations = this.store.stations;
  teams = this.store.teams;

  isRaceOver = this.store.raceIsOver;
  publishResults = this.store.publishResults;

  rankingItems = computed((): RankingItem[] => {
    const stations = this.stations();

    const segment = 100 / (stations.length + 1);
    const halfSegment = segment / 2;

    return this.teams().map((team) => {
      const latestResult = this.getLatestResult(team, stations);

      return {
        countdown: TeamUtils.getCountdown(team),
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
        time: TeamUtils.getTime(team),
      };
    });
  });

  constructor(
    private readonly authService: AuthService,
    private readonly preferencesService: PreferencesService,
    private readonly store: Store,
  ) {}

  hasStationId(rankingItem: RankingItem, stationId: string): boolean {
    return rankingItem.stationIds.includes(stationId);
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
