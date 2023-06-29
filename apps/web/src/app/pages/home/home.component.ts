import { CommonModule } from '@angular/common';
import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { map, timer } from 'rxjs';

import { Station, Team } from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  LoadingComponent,
} from '../../components';
import { CheckCircleIconComponent } from '../../icons/mini';
import { AuthService, StationService, TeamService } from '../../services';

dayjs.extend(duration);

export interface RankingItem {
  finished: boolean;
  name: string;
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
    LoadingComponent,
    RouterModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  isRaceOver = toSignal(this.teamService.isRaceOver$);
  isStation = toSignal(this.authService.isStation$);
  loading = toSignal(this.teamService.loading$, { initialValue: false });

  stations$ = this.stationService.stations$;
  stations = toSignal(this.stations$, { initialValue: [] as Station[] });

  teams$ = this.teamService.teams$;
  teams = toSignal(this.teams$, { initialValue: [] as Team[] });

  timer$ = timer(0, 1000).pipe(map(() => dayjs()));
  timer = toSignal(this.timer$, { initialValue: dayjs() });

  times = computed(() => {
    const now = this.timer();

    return this.teams().reduce<Record<string, number>>((times, team) => {
      return {
        ...times,
        [team.id]: this.calculateTeamTime(team, now),
      };
    }, {});
  });

  rankingItems = computed((): RankingItem[] => {
    return this.teams().map((team) => {
      return {
        finished: typeof team.finishedAt !== 'undefined',
        name: team.name,
        progress: 50,
        stationIds: team.results.map((result) => result.stationId),
        started: typeof team.startedAt !== 'undefined',
        teamId: team.id,
      };
    });
  });

  constructor(
    private readonly authService: AuthService,
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
}
