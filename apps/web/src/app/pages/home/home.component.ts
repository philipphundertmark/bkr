import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Observable, combineLatest, map, timer } from 'rxjs';

import { Team } from '@bkr/api-interface';

import {
  ButtonComponent,
  EmptyComponent,
  LoadingComponent,
} from '../../components';
import { CheckCircleIconComponent } from '../../icons/mini';
import { AuthService, TeamService } from '../../services';

dayjs.extend(duration);

export interface RankingItem {
  finished: boolean;
  name: string;
  teamId: string;
  time: number;
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
  teams = toSignal(this.teamService.teams$, { initialValue: [] as Team[] });

  teams$ = this.teamService.teams$;
  timer$ = timer(0, 1000).pipe(map(() => dayjs()));

  rankingItems$: Observable<RankingItem[]> = combineLatest([
    this.teams$,
    this.timer$,
  ]).pipe(
    map(([teams, now]) =>
      teams.map((team) => {
        return {
          finished: typeof team.finishedAt !== 'undefined',
          name: team.name,
          teamId: team.id,
          time:
            typeof team.startedAt !== 'undefined'
              ? typeof team.finishedAt !== 'undefined'
                ? team.finishedAt.diff(team.startedAt, 'seconds')
                : now.diff(team.startedAt, 'seconds')
              : 0,
        };
      })
    )
  );

  constructor(
    private readonly authService: AuthService,
    private readonly teamService: TeamService
  ) {}

  formatDuration(seconds: number): string {
    return dayjs.duration(seconds, 'seconds').format('HH:mm:ss');
  }
}
