import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { map, timer } from 'rxjs';

import { Result, Station, Team, TeamUtils } from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  RankingComponent,
} from '../../components';
import {
  CheckCircleIconComponent,
  TrophyIconComponent,
} from '../../icons/mini';
import {
  AuthService,
  SettingsService,
  StationService,
  TeamService,
} from '../../services';

dayjs.extend(duration);

export interface TimeByTeam {
  [teamId: string]: number;
}

export interface RankingItem {
  finished: boolean;
  name: string;
  number: number;
  progress: number;
  started: boolean;
  stationIds: string[];
  teamId: string;
}

@Component({
  selector: 'bkr-home',
  standalone: true,
  imports: [
    ButtonComponent,
    CheckCircleIconComponent,
    CommonModule,
    EmptyComponent,
    RankingComponent,
    RouterModule,
    TrophyIconComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  @HostBinding('class.page') page = true;

  isAdmin = toSignal(this.authService.isAdmin$, {
    initialValue: false,
  });
  isStation = toSignal(this.authService.isStation$, {
    initialValue: false,
  });

  isRaceOver = toSignal(this.teamService.isRaceOver$, {
    initialValue: false,
  });
  publishResults = toSignal(this.settingsService.publishResults$, {
    initialValue: false,
  });

  stations = toSignal(this.stationService.stations$, {
    initialValue: [] as Station[],
  });
  teams = toSignal(this.teamService.teams$, {
    initialValue: [] as Team[],
  });

  timer$ = timer(0, 1000).pipe(map(() => dayjs()));
  timer = toSignal(this.timer$, { initialValue: dayjs() });

  times = computed(() => {
    const now = this.timer();

    return this.teams().reduce<TimeByTeam>((times, team) => {
      return {
        ...times,
        [team.id]: this.calculateTeamTime(team, now),
      };
    }, {});
  });

  rankingItems = computed((): RankingItem[] => {
    const stations = this.stations();

    const segment = 100 / (stations.length + 1);
    const halfSegment = segment / 2;

    return this.teams().map((team) => {
      const latestResult = this.getLatestResult(team, stations);

      return {
        finished: TeamUtils.isFinished(team),
        name: TeamUtils.getTeamName(team),
        number: team.number,
        progress: TeamUtils.isFinished(team)
          ? 100
          : team.results.length
          ? team.results.length * segment +
            (typeof latestResult?.checkOut !== 'undefined' ? halfSegment : 0)
          : TeamUtils.isStarted(team)
          ? halfSegment
          : 0,
        stationIds: team.results.map((result) => result.stationId),
        started: TeamUtils.isStarted(team),
        teamId: team.id,
      };
    });
  });

  constructor(
    private readonly authService: AuthService,
    private readonly settingsService: SettingsService,
    private readonly stationService: StationService,
    private readonly teamService: TeamService
  ) {}

  formatDuration(seconds: number): string {
    return dayjs.duration(seconds, 'seconds').format('HH:mm:ss');
  }

  hasStationId(rankingItem: RankingItem, stationId: string): boolean {
    return rankingItem.stationIds.includes(stationId);
  }

  private calculateTeamTime(team: Team, now: dayjs.Dayjs): number {
    return typeof team.startedAt !== 'undefined'
      ? typeof team.finishedAt !== 'undefined'
        ? team.finishedAt.diff(team.startedAt, 'seconds')
        : now.diff(team.startedAt, 'seconds')
      : 0;
  }

  private getLatestResult(team: Team, stations: Station[]): Result | undefined {
    const stationNumbers = team.results
      .map(({ stationId }) => stations.find(({ id }) => id === stationId))
      .filter((station): station is Station => typeof station !== 'undefined')
      .map((station) => station.number);

    const maxStationNumber = Math.max(...stationNumbers);
    const latestStation = stations.find(
      ({ number }) => number === maxStationNumber
    );

    return team.results.find(
      ({ stationId }) => stationId === latestStation?.id
    );
  }
}
